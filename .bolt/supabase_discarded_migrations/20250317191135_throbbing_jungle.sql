/*
  # Add Initial Users

  1. Changes
    - Create initial admin user
    - Create initial partner user
    - Add proper roles and permissions
*/

-- Function to create initial admin user
CREATE OR REPLACE FUNCTION add_first_admin()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    'admin@anuarioesaude.com',
    crypt('Admin@2025', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}'
  )
  RETURNING id INTO new_user_id;

  -- Add user to admin_users table
  INSERT INTO admin_users (user_id, role)
  VALUES (new_user_id, 'admin');
END;
$$ LANGUAGE plpgsql;

-- Function to create initial partner user
CREATE OR REPLACE FUNCTION add_first_partner()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    'parceiro@anuarioesaude.com',
    crypt('Parceiro@2025', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Parceiro"}'
  )
  RETURNING id INTO new_user_id;

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
END;
$$ LANGUAGE plpgsql;

-- Create initial users
SELECT add_first_admin();
SELECT add_first_partner();

-- Cleanup: Drop the functions after use
DROP FUNCTION IF EXISTS add_first_admin();
DROP FUNCTION IF EXISTS add_first_partner();