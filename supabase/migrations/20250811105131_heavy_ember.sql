/*
  # Manual Migration Script
  
  Run this script in your Supabase SQL Editor to create the properties table
  and resolve the "relation does not exist" error.
  
  Instructions:
  1. Go to your Supabase Dashboard
  2. Navigate to SQL Editor
  3. Copy and paste this entire script
  4. Click "Run" to execute
*/

-- Create the properties table
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

-- Create RLS policies
CREATE POLICY "admin_full_access"
ON properties FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create public read policy
CREATE POLICY "Public users can view properties"
ON properties FOR SELECT
TO public
USING (true);

-- Create storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'property-images');

  CREATE POLICY "Authenticated Upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images');

  CREATE POLICY "Authenticated Delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images');
END $$;

-- Insert sample properties
INSERT INTO properties (
  title,
  price,
  location,
  type,
  beds,
  baths,
  size,
  features,
  image,
  images,
  status,
  listingtype,
  description,
  yearbuilt,
  energyclass,
  amenities
) VALUES 
(
  'Vila de Lux cu Piscină',
  '€750,000',
  'Aradul Nou',
  'house',
  5,
  4,
  '450m²',
  ARRAY['Piscină', 'Grădină', 'Garaj dublu'],
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=2070&auto=format&fit=crop'
  ],
  'active',
  'sale',
  'Această vilă impresionantă, situată într-o zonă exclusivistă din Aradul Nou, reprezintă esența luxului și confortului modern.',
  2022,
  'A+',
  ARRAY['Sistem de climatizare centralizat', 'Dressing-uri spațioase', 'Home cinema', 'Sală de fitness', 'Saună']
),
(
  'Penthouse Exclusivist',
  '€495,000',
  'Centru',
  'apartment',
  4,
  3,
  '220m²',
  ARRAY['Terasă', 'Vedere panoramică', 'Parcare'],
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
  ],
  'active',
  'sale',
  'Acest penthouse spectaculos, situat în inima orașului Arad, oferă o experiență de viață la înălțime cu priveliști panoramice impresionante asupra orașului.',
  2023,
  'A',
  ARRAY['Încălzire în pardoseală', 'Aer condiționat centralizat', 'Sistem audio multi-room', 'Electrocasnice premium']
),
(
  'Apartament Modern Podgoria',
  '€450/lună',
  'Podgoria',
  'apartment',
  2,
  1,
  '55m²',
  ARRAY['Mobilat complet', 'Centrală proprie', 'Vedere spre parc'],
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=2069&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=2069&auto=format&fit=crop'
  ],
  'active',
  'rent',
  'Apartament modern și luminos, complet mobilat și utilat, situat în zona Podgoria cu vedere spre parc.',
  2018,
  'B',
  ARRAY['Mobilier modern', 'Electrocasnice noi', 'Internet fibră optică']
);

-- Create articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  author text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles
CREATE POLICY "Enable read access for all users" 
  ON articles FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON articles FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON articles FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON articles FOR DELETE 
  TO authenticated 
  USING (true);