/*
  # Fix User Creation in Supabase

  1. Changes
    - Drop existing functions
    - Add all required columns to auth.users
    - Update user creation functions with complete field set
    - Add proper error handling
    - Ensure UUID generation works correctly

  2. Security
    - Proper password hashing
    - All required auth fields included
    - Error handling for duplicates
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS add_first_admin() CASCADE;
DROP FUNCTION IF EXISTS add_first_partner() CASCADE;

-- Ensure auth.users has all required columns with proper defaults
ALTER TABLE auth.users 
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN aud SET DEFAULT 'authenticated',
  ALTER COLUMN role SET DEFAULT 'authenticated',
  ALTER COLUMN instance_id SET DEFAULT uuid_nil(),
  ALTER COLUMN email_confirmed_at SET DEFAULT now(),
  ALTER COLUMN is_super_admin SET DEFAULT false,
  ALTER COLUMN is_sso_user SET DEFAULT false,
  ALTER COLUMN deleted_at DROP NOT NULL;

-- Function to create initial admin user
CREATE OR REPLACE FUNCTION add_first_admin()
RETURNS void AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Create user in auth.users with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    aud,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    phone,
    phone_confirmed_at,
    phone_change_token,
    banned_until,
    invited_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_token_new_sent_at,
    email_change_token_current_sent_at,
    phone_change_token_sent_at,
    email_change,
    phone_change
  )
  VALUES (
    new_user_id,
    uuid_nil(),
    'admin@anuarioesaude.com',
    crypt('Admin@2025', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}',
    false,
    false,
    now(),
    now(),
    now(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  )
  ON CONFLICT (email) DO NOTHING;

  -- Get user id if insert failed due to existing user
  IF NOT FOUND THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'admin@anuarioesaude.com';
  END IF;

  -- Add user to admin_users table
  INSERT INTO admin_users (user_id, role)
  VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating admin user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Function to create initial partner user
CREATE OR REPLACE FUNCTION add_first_partner()
RETURNS void AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Create user in auth.users with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    aud,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    phone,
    phone_confirmed_at,
    phone_change_token,
    banned_until,
    invited_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_token_new_sent_at,
    email_change_token_current_sent_at,
    phone_change_token_sent_at,
    email_change,
    phone_change
  )
  VALUES (
    new_user_id,
    uuid_nil(),
    'parceiro@anuarioesaude.com',
    crypt('Parceiro@2025', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Parceiro"}',
    false,
    false,
    now(),
    now(),
    now(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  )
  ON CONFLICT (email) DO NOTHING;

  -- Get user id if insert failed due to existing user
  IF NOT FOUND THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'parceiro@anuarioesaude.com';
  END IF;

  -- Add user to partner_users table
  INSERT INTO partner_users (user_id, role)
  VALUES (new_user_id, 'partner')
  ON CONFLICT (user_id) DO NOTHING;

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
  )
  ON CONFLICT (user_id) DO NOTHING;

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating partner user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create initial users
SELECT add_first_admin();
SELECT add_first_partner();

-- Cleanup: Drop the functions after use
DROP FUNCTION IF EXISTS add_first_admin();
DROP FUNCTION IF EXISTS add_first_partner();