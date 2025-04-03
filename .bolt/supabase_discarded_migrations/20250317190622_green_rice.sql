/*
  # Database Structure Fix

  1. Tables
    - admin_users
    - partner_users
    - partner_profiles
    - doctor_profiles
    - doctor_locations
    - doctor_specialties
    - doctor_education
    - doctor_experience
    - doctor_services
    - doctor_availability

  2. Security
    - RLS enabled on all tables
    - Appropriate access policies
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Create partner_users table
CREATE TABLE IF NOT EXISTS partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL DEFAULT 'partner',
  created_at timestamptz DEFAULT now()
);

-- Create partner_profiles table
CREATE TABLE IF NOT EXISTS partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text,
  specialty text,
  bio text,
  address text,
  phone text,
  email text,
  website text,
  working_hours text,
  profile_image text,
  certifications text[],
  languages text[],
  insurance_accepted text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  full_name text NOT NULL,
  profile_photo_url text,
  cover_photo_url text,
  registration_number text NOT NULL,
  bio text,
  short_bio text,
  gender text,
  languages text[],
  website text,
  social_media jsonb DEFAULT '{}'::jsonb,
  contact_email text,
  contact_phone text,
  verified boolean DEFAULT false,
  featured boolean DEFAULT false,
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_locations table
CREATE TABLE IF NOT EXISTS doctor_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Brasil',
  coordinates point,
  phone text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_specialties table
CREATE TABLE IF NOT EXISTS doctor_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  specialty text NOT NULL,
  board_certified boolean DEFAULT false,
  certification_year integer,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_education table
CREATE TABLE IF NOT EXISTS doctor_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text NOT NULL,
  start_year integer NOT NULL,
  end_year integer,
  ongoing boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_experience table
CREATE TABLE IF NOT EXISTS doctor_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  institution text NOT NULL,
  position text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_services table
CREATE TABLE IF NOT EXISTS doctor_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  service_name text NOT NULL,
  description text,
  duration_minutes integer,
  price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
  location_id uuid REFERENCES doctor_locations ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_locations_doctor_id ON doctor_locations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_specialties_doctor_id ON doctor_specialties(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_education_doctor_id ON doctor_education(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_experience_doctor_id ON doctor_experience(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_services_doctor_id ON doctor_services(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_location_id ON doctor_availability(location_id);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow partner self-management" ON partner_users
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON partner_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read own profile" ON doctor_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone" ON doctor_profiles
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can update own profile" ON doctor_profiles
  FOR ALL TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Public locations are viewable" ON doctor_locations
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their locations" ON doctor_locations
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_locations.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Public specialties are viewable" ON doctor_specialties
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their specialties" ON doctor_specialties
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_specialties.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Public education is viewable" ON doctor_education
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their education" ON doctor_education
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_education.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Public experience is viewable" ON doctor_experience
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their experience" ON doctor_experience
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_experience.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Public services are viewable" ON doctor_services
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their services" ON doctor_services
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_services.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Public availability is viewable" ON doctor_availability
  FOR SELECT TO public USING (true);

CREATE POLICY "Doctors can manage their availability" ON doctor_availability
  FOR ALL TO public
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles
    WHERE doctor_profiles.id = doctor_availability.doctor_id
    AND doctor_profiles.user_id = auth.uid()
  ));