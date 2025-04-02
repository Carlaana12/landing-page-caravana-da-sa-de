/*
  # Fix auth.users Table Structure

  1. Changes
    - Add default UUID generation for id column
    - Update user creation functions to explicitly set UUID
    - Ensure proper error handling
*/

-- Ensure id column has proper UUID default
ALTER TABLE auth.users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update function to create initial admin user with explicit UUID
CREATE OR REPLACE FUNCTION add_first_admin()
RETURNS void AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Create user in auth.users with explicit UUID
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    new_user_id,
    'admin@anuarioesaude.com',
    crypt('Admin@2025', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}',
    'authenticated',
    'authenticated'
  );

  -- Add user to admin_users table
  INSERT INTO admin_users (user_id, role)
  VALUES (new_user_id, 'admin');

EXCEPTION WHEN unique_violation THEN
  -- Handle case where user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'admin@anuarioesaude.com';
  
  -- Ensure admin_users entry exists
  INSERT INTO admin_users (user_id, role)
  VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Update function to create initial partner user with explicit UUID
CREATE OR REPLACE FUNCTION add_first_partner()
RETURNS void AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Create user in auth.users with explicit UUID
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    new_user_id,
    'parceiro@anuarioesaude.com',
    crypt('Parceiro@2025', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Parceiro"}',
    'authenticated',
    'authenticated'
  );

  -- Add user to partner_users table
  INSERT INTO partner_users (user_id, role)
  VALUES (new_user_id, 'partner');

  -- Create initial partner profile
  INSERT INTO partner_profiles (
    user_id,
    name,
    specialty,
    bio,
    email
  )
  VALUES (
    new_user_id,
    'Parceiro Demo',
    'Clínica Geral',
    'Perfil inicial para demonstração',
    'parceiro@anuarioesaude.com'
  );

EXCEPTION WHEN unique_violation THEN
  -- Handle case where user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'parceiro@anuarioesaude.com';
  
  -- Ensure partner_users entry exists
  INSERT INTO partner_users (user_id, role)
  VALUES (new_user_id, 'partner')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Ensure partner_profiles entry exists
  INSERT INTO partner_profiles (
    user_id,
    name,
    specialty,
    bio,
    email
  )
  VALUES (
    new_user_id,
    'Parceiro Demo',
    'Clínica Geral',
    'Perfil inicial para demonstração',
    'parceiro@anuarioesaude.com'
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create initial users
SELECT add_first_admin();
SELECT add_first_partner();

-- Cleanup: Drop the functions after use
DROP FUNCTION IF EXISTS add_first_admin();
DROP FUNCTION IF EXISTS add_first_partner();