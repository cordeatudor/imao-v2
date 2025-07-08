DO $$ 
BEGIN
  -- First ensure RLS is enabled
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable insert for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable update for authenticated users" ON properties;
  DROP POLICY IF EXISTS "Enable delete for authenticated users" ON properties;

  -- Create new simplified policies
  CREATE POLICY "Enable read access for all users"
    ON properties FOR SELECT
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON properties FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

  CREATE POLICY "Enable update for authenticated users"
    ON properties FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

  CREATE POLICY "Enable delete for authenticated users"
    ON properties FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

  -- Grant necessary permissions
  GRANT ALL ON properties TO authenticated;
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error occurred: %', SQLERRM;
  RAISE;
END $$;