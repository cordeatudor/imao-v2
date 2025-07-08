/*
  # Fix Admin Panel Permissions

  1. Changes
    - Reset and simplify RLS policies
    - Ensure proper permissions for authenticated users
    - Fix table access rights

  2. Security
    - Maintain basic security while allowing admin access
    - Grant appropriate permissions to authenticated role
*/

DO $$ 
BEGIN
  -- First ensure RLS is enabled
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON properties;

  -- Create new simplified policies
  CREATE POLICY "Enable read access for all users"
    ON properties FOR SELECT
    USING (true);

  CREATE POLICY "Enable full access for authenticated users"
    ON properties FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

  -- Ensure proper permissions
  GRANT ALL ON properties TO authenticated;
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error occurred: %', SQLERRM;
  RAISE;
END $$;