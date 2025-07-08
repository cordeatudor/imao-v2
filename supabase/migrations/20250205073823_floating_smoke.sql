/*
  # Create properties table and security policies

  1. New Tables
    - `properties` table for storing property listings
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create the properties table
DO $$ 
BEGIN
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
    status text NOT NULL,
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
END $$;

-- Create policies in separate transactions
DO $$ 
BEGIN
  CREATE POLICY "Enable read access for authenticated users only" 
    ON properties FOR SELECT 
    TO authenticated 
    USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Enable write access for authenticated users only" 
    ON properties FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Enable update for authenticated users only" 
    ON properties FOR UPDATE 
    TO authenticated 
    USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Enable delete for authenticated users only" 
    ON properties FOR DELETE 
    TO authenticated 
    USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;