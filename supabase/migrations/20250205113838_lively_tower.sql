/*
  # Initialize Properties Table

  1. New Tables
    - Ensures properties table exists with correct structure
    - Adds sample properties if table is empty
  
  2. Security
    - Enables RLS
    - Adds policies for authenticated users
*/

-- First ensure the properties table exists with all required columns
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

-- Create RLS policies
DO $$ 
BEGIN
  -- Read policy
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON properties;
  CREATE POLICY "Enable read access for authenticated users" 
    ON properties FOR SELECT 
    TO authenticated 
    USING (true);

  -- Insert policy
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON properties;
  CREATE POLICY "Enable insert access for authenticated users" 
    ON properties FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

  -- Update policy
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON properties;
  CREATE POLICY "Enable update access for authenticated users" 
    ON properties FOR UPDATE 
    TO authenticated 
    USING (true);

  -- Delete policy
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON properties;
  CREATE POLICY "Enable delete access for authenticated users" 
    ON properties FOR DELETE 
    TO authenticated 
    USING (true);
END $$;

-- Insert sample properties if none exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM properties LIMIT 1) THEN
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
      listingType,
      description,
      yearBuilt,
      energyClass,
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
        'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
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
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687126-c2d22673c16d?q=80&w=2053&auto=format&fit=crop'
      ],
      'active',
      'sale',
      'Acest penthouse spectaculos, situat în inima orașului Arad, oferă o experiență de viață la înălțime cu priveliști panoramice impresionante asupra orașului.',
      2023,
      'A',
      ARRAY['Încălzire în pardoseală', 'Aer condiționat centralizat', 'Sistem audio multi-room', 'Electrocasnice premium']
    );
  END IF;
END $$;