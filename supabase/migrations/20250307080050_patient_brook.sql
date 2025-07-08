/*
  # Create properties table and policies

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
      - `listingtype` (text)
      - `description` (text)
      - `yearbuilt` (integer)
      - `energyclass` (text)
      - `amenities` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for authenticated users to perform all operations
*/

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
  listingtype text NOT NULL,
  description text,
  yearbuilt integer,
  energyclass text,
  amenities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'properties' 
    AND policyname = 'admin_full_access'
  ) THEN
    CREATE POLICY "admin_full_access"
      ON properties
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;