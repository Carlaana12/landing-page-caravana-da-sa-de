/*
  # Add Doctor Profile Fields

  1. Changes
    - Add fields to doctor_profiles table
    - Add fields to partner_profiles table
    - Add working_hours field
    - Add address field
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add fields to partner_profiles if they don't exist
ALTER TABLE partner_profiles 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS working_hours text;

-- Add fields to doctor_profiles if they don't exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = 'doctor_profiles') THEN
    
    -- Add columns if they don't exist
    BEGIN
      ALTER TABLE doctor_profiles 
      ADD COLUMN IF NOT EXISTS working_hours text,
      ADD COLUMN IF NOT EXISTS address text;
    EXCEPTION WHEN OTHERS THEN
      -- Handle error
    END;
  END IF;
END $$;

-- Update existing partner profiles with sample data
UPDATE partner_profiles
SET 
  working_hours = 'Segunda a Sexta: 8h às 18h',
  address = 'Setor Médico Hospitalar Sul, Quadra 102'
WHERE 
  working_hours IS NULL AND
  name IS NOT NULL;