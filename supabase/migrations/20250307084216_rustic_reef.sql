/*
  # Properties and Storage Setup

  1. Database Changes
    - Create properties table with proper structure
    - Enable RLS and add access policies
  
  2. Storage Setup
    - Create storage bucket for property images
    - Add storage policies for secure access
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
  status text NOT NULL DEFAULT 'active',
  listingtype text NOT NULL DEFAULT 'sale',
  description text,
  yearbuilt integer,
  energyclass text,
  amenities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Public users can view properties'
  ) THEN
    CREATE POLICY "Public users can view properties"
      ON properties
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Authenticated users can manage properties'
  ) THEN
    CREATE POLICY "Authenticated users can manage properties"
      ON properties
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

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

-- Create storage policies directly on storage.objects
DO $$
BEGIN
  -- Public read access policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'property-images');
  END IF;

  -- Authenticated users upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Authenticated Upload'
  ) THEN
    CREATE POLICY "Authenticated Upload"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'property-images');
  END IF;

  -- Authenticated users delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Authenticated Delete'
  ) THEN
    CREATE POLICY "Authenticated Delete"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'property-images');
  END IF;
END $$;