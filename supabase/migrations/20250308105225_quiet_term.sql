/*
  # Create properties table

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `price` (text) 
      - `location` (text)
      - `type` (text)
      - `beds` (integer)
      - `baths` (integer)
      - `size` (text)
      - `features` (text[])
      - `image` (text)
      - `images` (text[])
      - `status` (text)
      - `listingType` (text)
      - `description` (text)
      - `yearBuilt` (integer)
      - `energyClass` (text)
      - `amenities` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `properties` table
    - Add policies for authenticated users to manage properties
    - Add policy for public users to view properties
*/

-- Create the properties table if it doesn't exist
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

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can manage properties" ON properties;
    DROP POLICY IF EXISTS "Public users can view properties" ON properties;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create policies
CREATE POLICY "Authenticated users can manage properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can view properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);