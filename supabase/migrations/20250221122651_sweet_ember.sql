/*
  # Fix RLS Policies for Properties Table

  1. Changes
    - Clean up existing policies
    - Set up proper RLS
    - Configure permissions for authenticated users

  2. Security
    - Enable RLS on properties table
    - Grant appropriate permissions to authenticated role
*/

DO $$ 
BEGIN
  -- Ensure the properties table exists
  CREATE TABLE IF NOT EXISTS properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    price text NOT NULL,
    location text NOT NULL,
    type text NOT NULL,
    beds integer,
    baths integer,
    size text,
    features text[],
    image text NOT NULL,
    images text[],
    status text NOT NULL DEFAULT 'active',
    listingType text NOT NULL,
    description text,
    yearBuilt integer,
    energyClass text,
    amenities text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties') THEN
    DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable delete for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable full access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable update access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable update for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable update for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable write access for authenticated users" ON properties;
    DROP POLICY IF EXISTS "Enable write access for authenticated users only" ON properties;
  END IF;

  -- Create new policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Enable read access for all users') THEN
    CREATE POLICY "Enable read access for all users"
    ON properties FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Enable full access for authenticated users') THEN
    CREATE POLICY "Enable full access for authenticated users"
    ON properties FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;

  -- Ensure proper permissions
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT ALL ON properties TO authenticated;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

EXCEPTION WHEN OTHERS THEN
  -- Log error details
  RAISE NOTICE 'Error occurred: %', SQLERRM;
  RAISE;
END $$;