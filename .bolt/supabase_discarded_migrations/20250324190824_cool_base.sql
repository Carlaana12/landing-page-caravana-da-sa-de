-- Start with a clean slate
BEGIN;

-- Disable RLS temporarily
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON admin_users;
DROP POLICY IF EXISTS "Acesso admin_users para admins" ON admin_users;
DROP POLICY IF EXISTS "enable_admin_access" ON admin_users;
DROP POLICY IF EXISTS "admin_access_policy" ON admin_users;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS first_admin_trigger ON auth.users;
DROP FUNCTION IF EXISTS add_first_admin();

-- Create new admin verification function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
  )
  OR
  auth.email() = 'ciacomunicacaointegrada@gmail.com'
$$;

-- Create function to add first admin
CREATE OR REPLACE FUNCTION add_first_admin()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF lower(NEW.email) = 'ciacomunicacaointegrada@gmail.com' THEN
    INSERT INTO public.admin_users (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic admin creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION add_first_admin();

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create simplified policy using the is_admin function
CREATE POLICY "admin_access_policy"
ON admin_users
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

COMMIT;