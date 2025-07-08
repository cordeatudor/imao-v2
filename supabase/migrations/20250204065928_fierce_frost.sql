/*
  # Fix Authentication and Row Level Security Policies

  1. Security
    - Create auth schema if not exists
    - Safely handle existing policies
    - Ensure RLS is enabled
    - Add policies for authenticated users if they don't exist

  2. Changes
    - Drop existing policies if they exist
    - Recreate policies with proper checks
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable write access for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable update for authenticated users only" ON properties;
    DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON properties;
END $$;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users only" 
ON properties FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable write access for authenticated users only" 
ON properties FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON properties FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON properties FOR DELETE 
TO authenticated 
USING (true);