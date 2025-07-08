DO $$ 
BEGIN
  -- First ensure RLS is enabled
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop ALL existing policies to start fresh
  DROP POLICY IF EXISTS "authenticated_full_access" ON properties;

  -- Create single policy for authenticated users with full access
  CREATE POLICY "admin_full_access"
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