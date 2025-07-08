/*
  # Create properties table and storage configuration

  1. New Tables
    - `properties` table with all required fields
  
  2. Storage
    - Handle property images bucket
    
  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing table and policies if they exist
DROP POLICY IF EXISTS admin_full_access ON properties;
DROP TABLE IF EXISTS properties;

-- Create the properties table
CREATE TABLE properties (
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

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create the admin policy
CREATE POLICY admin_full_access
  ON properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for property images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('property-images', 'property-images', true);
  END IF;
END $$;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view images" ON storage.objects;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow public access to view images
CREATE POLICY "Public users can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');