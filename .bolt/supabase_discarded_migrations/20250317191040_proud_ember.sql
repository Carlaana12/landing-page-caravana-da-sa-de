/*
  # Database Structure Fix

  1. Changes
    - Drop all existing tables to ensure clean state
    - Recreate tables with proper constraints
    - Add missing indexes
    - Fix security policies
    - Add triggers for updated_at
    - Add proper foreign key relationships

  2. Tables Fixed
    - admin_users
    - partner_users
    - partner_profiles
    - doctor_profiles and related tables
    - content management tables
*/

-- Drop existing tables in correct order
DROP TABLE IF EXISTS doctor_availability CASCADE;
DROP TABLE IF EXISTS doctor_services CASCADE;
DROP TABLE IF EXISTS doctor_experience CASCADE;
DROP TABLE IF EXISTS doctor_education CASCADE;
DROP TABLE IF EXISTS doctor_specialties CASCADE;
DROP TABLE IF EXISTS doctor_locations CASCADE;
DROP TABLE IF EXISTS doctor_profiles CASCADE;
DROP TABLE IF EXISTS partner_profiles CASCADE;
DROP TABLE IF EXISTS partner_users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS carousel_items CASCADE;
DROP TABLE IF EXISTS highlights CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS media_items CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS site_appearance CASCADE;
DROP TABLE IF EXISTS site_sections CASCADE;
DROP TABLE IF EXISTS site_pages CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create admin_users table
CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    role text NOT NULL DEFAULT 'admin',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create partner_users table
CREATE TABLE partner_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    role text NOT NULL DEFAULT 'partner',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create partner_profiles table
CREATE TABLE partner_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
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
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create doctor_profiles table
CREATE TABLE doctor_profiles (
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
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_locations table
CREATE TABLE doctor_locations (
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
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_specialties table
CREATE TABLE doctor_specialties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
    specialty text NOT NULL,
    board_certified boolean DEFAULT false,
    certification_year integer,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_education table
CREATE TABLE doctor_education (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
    institution text NOT NULL,
    degree text NOT NULL,
    field_of_study text NOT NULL,
    start_year integer NOT NULL,
    end_year integer,
    ongoing boolean DEFAULT false,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_experience table
CREATE TABLE doctor_experience (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
    institution text NOT NULL,
    position text NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date,
    current boolean DEFAULT false,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_services table
CREATE TABLE doctor_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
    service_name text NOT NULL,
    description text,
    duration_minutes integer,
    price numeric(10,2),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor_availability table
CREATE TABLE doctor_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES doctor_profiles ON DELETE CASCADE,
    location_id uuid REFERENCES doctor_locations ON DELETE CASCADE,
    day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time time NOT NULL,
    end_time time NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create carousel_items table
CREATE TABLE carousel_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create highlights table
CREATE TABLE highlights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    icon text NOT NULL,
    color text NOT NULL DEFAULT '#408040',
    display_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    date text NOT NULL,
    location text NOT NULL,
    image_url text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create media_items table
CREATE TABLE media_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL,
    description text,
    url text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create ads table
CREATE TABLE ads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    link text,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create site_appearance table
CREATE TABLE site_appearance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_colors jsonb NOT NULL DEFAULT '{
        "primary": "#408040",
        "secondary": "#1a3d1a",
        "accent": "#66b366",
        "text": "#1a1a1a",
        "background": "#ffffff"
    }'::jsonb,
    typography jsonb NOT NULL DEFAULT '{
        "headingFont": "Montserrat",
        "bodyFont": "Inter",
        "baseFontSize": "16px",
        "lineHeight": "1.5"
    }'::jsonb,
    spacing jsonb NOT NULL DEFAULT '{
        "containerPadding": "1rem",
        "sectionSpacing": "4rem"
    }'::jsonb,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create site_sections table
CREATE TABLE site_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    content jsonb NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create site_pages table
CREATE TABLE site_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content jsonb NOT NULL DEFAULT '{"sections": []}'::jsonb,
    meta_description text,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX idx_doctor_locations_doctor_id ON doctor_locations(doctor_id);
CREATE INDEX idx_doctor_specialties_doctor_id ON doctor_specialties(doctor_id);
CREATE INDEX idx_doctor_education_doctor_id ON doctor_education(doctor_id);
CREATE INDEX idx_doctor_experience_doctor_id ON doctor_experience(doctor_id);
CREATE INDEX idx_doctor_services_doctor_id ON doctor_services(doctor_id);
CREATE INDEX idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_location_id ON doctor_availability(location_id);
CREATE INDEX idx_carousel_display_order ON carousel_items(display_order);
CREATE INDEX idx_highlights_display_order ON highlights(display_order);

-- Create triggers for updated_at
CREATE TRIGGER update_partner_profiles_updated_at
    BEFORE UPDATE ON partner_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at
    BEFORE UPDATE ON doctor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousel_items_updated_at
    BEFORE UPDATE ON carousel_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_highlights_updated_at
    BEFORE UPDATE ON highlights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at
    BEFORE UPDATE ON media_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_appearance_updated_at
    BEFORE UPDATE ON site_appearance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
    BEFORE UPDATE ON site_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_pages_updated_at
    BEFORE UPDATE ON site_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Allow authenticated read access" ON admin_users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow partner self-management" ON partner_users
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON partner_users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read own profile" ON partner_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON partner_profiles
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Allow public read access" ON carousel_items
    FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON carousel_items
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON highlights
    FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON highlights
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON events
    FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON events
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON media_items
    FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON media_items
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON ads
    FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON ads
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON site_appearance
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access" ON site_appearance
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON site_sections
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow admin full access" ON site_sections
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

CREATE POLICY "Allow public read access" ON site_pages
    FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Allow admin full access" ON site_pages
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));