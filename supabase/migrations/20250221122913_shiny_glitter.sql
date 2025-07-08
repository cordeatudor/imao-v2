/*
  # Fix Admin Panel Access

  1. Changes
    - Simplify RLS policies
    - Ensure admin has full access
    - Fix permissions for properties table

  2. Security
    - Maintain RLS while ensuring admin access
    - Grant appropriate permissions
*/

DO $$ 
BEGIN
  -- First ensure RLS is enabled
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop all existing policies to start fresh
  DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON properties;

  -- Create simplified policies
  CREATE POLICY "Enable read access for all users"
    ON properties FOR SELECT
    USING (true);

  CREATE POLICY "Enable full access for authenticated users"
    ON properties FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Grant necessary permissions
  GRANT ALL ON properties TO authenticated;
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error occurred: %', SQLERRM;
  RAISE;
END $$;