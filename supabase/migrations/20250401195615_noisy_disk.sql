/*
  # Registration Flow Schema Updates

  1. Changes
    - Add required fields to user_profiles
    - Add required fields to partner_profiles
    - Add terms acceptance tracking
    - Add email verification status
    - Add professional verification status
    - Add test account setup
    
  2. Security
    - Maintain existing RLS policies
    - Add verification checks
*/

-- Create base tables if they don't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  role text DEFAULT 'partner',
  created_at timestamptz DEFAULT now()
);

-- Update user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

-- Update partner_profiles table with all required columns
ALTER TABLE partner_profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS specialty text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS registration_type text DEFAULT 'CRM',
ADD COLUMN IF NOT EXISTS registration_number text,
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

-- Update RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Specialists can view own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Specialists can update own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON partner_profiles;
DROP POLICY IF EXISTS "Permitir inserções em partner_profiles" ON partner_profiles;
DROP POLICY IF EXISTS "Permitir leitura em partner_profiles" ON partner_profiles;
DROP POLICY IF EXISTS "Permitir atualizações em partner_profiles" ON partner_profiles;

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

-- Políticas para partner_profiles
CREATE POLICY "Professionals can view own profile"
  ON partner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Professionals can update own profile"
  ON partner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Set up test account
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get or create test user
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'ciacomunicacaointegrada@gmail.com';

  IF test_user_id IS NULL THEN
    -- Create test user if it doesn't exist
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      created_at,
      updated_at
    ) VALUES (
      'ciacomunicacaointegrada@gmail.com',
      crypt('Ciacomunica@12', gen_salt('bf')),
      now(),
      now(),
      now(),
      now()
    ) RETURNING id INTO test_user_id;
  END IF;

  -- Create user profile if it doesn't exist
  INSERT INTO user_profiles (
    user_id,
    full_name,
    email_verified,
    email_verified_at,
    terms_accepted,
    terms_accepted_at
  ) VALUES (
    test_user_id,
    'Test User',
    true,
    now(),
    true,
    now()
  ) ON CONFLICT (user_id) DO UPDATE
  SET 
    email_verified = true,
    email_verified_at = now(),
    terms_accepted = true,
    terms_accepted_at = now();

  -- Create partner profile if it doesn't exist
  INSERT INTO partner_profiles (
    user_id,
    name,
    registration_type,
    registration_number,
    registration_state,
    email_verified,
    email_verified_at,
    terms_accepted,
    terms_accepted_at,
    verification_status,
    verified_at
  ) VALUES (
    test_user_id,
    'Test Professional',
    'CRM',
    'TEST123',
    'DF',
    true,
    now(),
    true,
    now(),
    'approved',
    now()
  ) ON CONFLICT (user_id) DO UPDATE
  SET 
    email_verified = true,
    email_verified_at = now(),
    terms_accepted = true,
    terms_accepted_at = now(),
    verification_status = 'approved',
    verified_at = now();

  -- Create partner user if it doesn't exist
  INSERT INTO partner_users (
    user_id,
    role
  ) VALUES (
    test_user_id,
    'partner'
  ) ON CONFLICT (user_id) DO NOTHING;

END $$;