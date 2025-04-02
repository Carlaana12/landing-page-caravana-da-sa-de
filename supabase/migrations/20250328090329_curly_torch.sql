/*
  # Fix Highlights Admin Functionality

  1. Changes
    - Drop and recreate RLS policies with proper admin checks
    - Add better admin verification function
    - Update trigger for immediate updates
    - Add notification channel
    
  2. Security
    - Proper admin access verification
    - Safe data handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "highlights_public_read_policy" ON highlights;
DROP POLICY IF EXISTS "highlights_admin_full_policy" ON highlights;

-- Create better admin verification function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies with proper checks
CREATE POLICY "highlights_public_read_policy"
ON highlights
FOR SELECT
TO public
USING (true);

CREATE POLICY "highlights_admin_full_policy"
ON highlights
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid())
)
WITH CHECK (
  is_admin(auth.uid())
);

-- Update trigger for better realtime support
CREATE OR REPLACE FUNCTION update_highlights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  
  -- Notify about the change
  PERFORM pg_notify(
    'highlights_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'type', TG_OP,
      'id', NEW.id,
      'record', row_to_json(NEW)
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_highlights_updated_at ON highlights;
CREATE TRIGGER update_highlights_updated_at
  BEFORE UPDATE ON highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_highlights_updated_at();

-- Ensure RLS is enabled
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;