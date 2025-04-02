/*
  # Add Admin User to Other Portals

  1. Changes
    - Add admin user to user_profiles
    - Add admin user to partner_users
    - Add admin user to partner_profiles
    
  2. Security
    - Maintain existing permissions
    - Safe insertion with conflict handling
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'ciacomunicacaointegra@gmail.com';

  IF admin_user_id IS NOT NULL THEN
    -- Add to user_profiles
    INSERT INTO user_profiles (
      user_id,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'Admin User',
      now(),
      now()
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Add to partner_users
    INSERT INTO partner_users (
      user_id,
      role,
      created_at
    ) VALUES (
      admin_user_id,
      'partner',
      now()
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Add to partner_profiles
    INSERT INTO partner_profiles (
      user_id,
      name,
      registration_number,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'Admin User',
      'ADM123',
      now(),
      now()
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Add user settings
    INSERT INTO user_settings (
      user_id,
      email_notifications,
      sms_notifications,
      appointment_reminders,
      newsletter_subscription
    ) VALUES (
      admin_user_id,
      true,
      true,
      true,
      true
    ) ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;