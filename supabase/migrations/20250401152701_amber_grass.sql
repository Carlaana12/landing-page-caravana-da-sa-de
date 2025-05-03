/*
  # Registration Flow Schema Updates

  1. Changes
    - Add required fields to user_profiles
    - Add required fields to partner_profiles
    - Add terms acceptance tracking
    - Add email verification status
    - Add professional verification status
    
  2. Security
    - Maintain existing RLS policies
    - Add verification checks
*/

-- Update user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

-- Update partner_profiles table
ALTER TABLE partner_profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS registration_type text NOT NULL DEFAULT 'CRM',
ADD COLUMN IF NOT EXISTS registration_state text,
ADD COLUMN IF NOT EXISTS registration_expiry date,
ADD COLUMN IF NOT EXISTS document_url text,
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_notes text,
ADD COLUMN IF NOT EXISTS verified_at timestamptz,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users;

-- Add registration types enum
DO $$ BEGIN
  CREATE TYPE registration_type AS ENUM (
    'CRM', 'CRO', 'CREFITO', 'CRP', 'COREN', 'OUTRO'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add verification status enum
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM (
    'pending', 'approved', 'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update partner_profiles constraints
ALTER TABLE partner_profiles
DROP CONSTRAINT IF EXISTS valid_registration_type;

ALTER TABLE partner_profiles
ADD CONSTRAINT valid_registration_type 
CHECK (registration_type IN ('CRM', 'CRO', 'CREFITO', 'CRP', 'COREN', 'OUTRO'));

ALTER TABLE partner_profiles
DROP CONSTRAINT IF EXISTS valid_verification_status;

ALTER TABLE partner_profiles
ADD CONSTRAINT valid_verification_status 
CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Function to handle email verification
CREATE OR REPLACE FUNCTION handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_verified AND OLD.email_verified = false THEN
    NEW.email_verified_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle terms acceptance
CREATE OR REPLACE FUNCTION handle_terms_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.terms_accepted AND OLD.terms_accepted = false THEN
    NEW.terms_accepted_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle professional verification
CREATE OR REPLACE FUNCTION handle_professional_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status = 'approved' AND OLD.verification_status != 'approved' THEN
    NEW.verified_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS email_verification_trigger ON user_profiles;
CREATE TRIGGER email_verification_trigger
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  WHEN (NEW.email_verified IS DISTINCT FROM OLD.email_verified)
  EXECUTE FUNCTION handle_email_verification();

DROP TRIGGER IF EXISTS terms_acceptance_trigger ON user_profiles;
CREATE TRIGGER terms_acceptance_trigger
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  WHEN (NEW.terms_accepted IS DISTINCT FROM OLD.terms_accepted)
  EXECUTE FUNCTION handle_terms_acceptance();

DROP TRIGGER IF EXISTS partner_email_verification_trigger ON partner_profiles;
CREATE TRIGGER partner_email_verification_trigger
  BEFORE UPDATE ON partner_profiles
  FOR EACH ROW
  WHEN (NEW.email_verified IS DISTINCT FROM OLD.email_verified)
  EXECUTE FUNCTION handle_email_verification();

DROP TRIGGER IF EXISTS partner_terms_acceptance_trigger ON partner_profiles;
CREATE TRIGGER partner_terms_acceptance_trigger
  BEFORE UPDATE ON partner_profiles
  FOR EACH ROW
  WHEN (NEW.terms_accepted IS DISTINCT FROM OLD.terms_accepted)
  EXECUTE FUNCTION handle_terms_acceptance();

DROP TRIGGER IF EXISTS partner_verification_trigger ON partner_profiles;
CREATE TRIGGER partner_verification_trigger
  BEFORE UPDATE ON partner_profiles
  FOR EACH ROW
  WHEN (NEW.verification_status IS DISTINCT FROM OLD.verification_status)
  EXECUTE FUNCTION handle_professional_verification();

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create profile" ON user_profiles;
DROP POLICY IF EXISTS "Specialists can view own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Specialists can update own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Specialists can create profile" ON partner_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON partner_profiles;

-- Create new policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Specialists can view own profile"
  ON partner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Specialists can update own profile"
  ON partner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Specialists can create profile"
  ON partner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles"
  ON partner_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );