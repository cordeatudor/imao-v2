DO $$ 
BEGIN
  -- First ensure RLS is enabled
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop ALL existing policies to start fresh
  DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable write for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable insert for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable update for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable delete for authenticated users" ON properties;
  DROP POLICY IF EXISTS "public_read_access" ON properties;
  DROP POLICY IF EXISTS "authenticated_insert_access" ON properties;
  DROP POLICY IF EXISTS "authenticated_update_access" ON properties;
  DROP POLICY IF EXISTS "authenticated_delete_access" ON properties;
  DROP POLICY IF EXISTS "allow_public_read" ON properties;
  DROP POLICY IF EXISTS "allow_auth_insert" ON properties;
  DROP POLICY IF EXISTS "allow_auth_update" ON properties;
  DROP POLICY IF EXISTS "allow_auth_delete" ON properties;
  DROP POLICY IF EXISTS "properties_public_read" ON properties;
  DROP POLICY IF EXISTS "properties_auth_insert" ON properties;
  DROP POLICY IF EXISTS "properties_auth_update" ON properties;
  DROP POLICY IF EXISTS "properties_auth_delete" ON properties;

  -- Create single policy for authenticated users with full access
  CREATE POLICY "authenticated_full_access"
    ON properties
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