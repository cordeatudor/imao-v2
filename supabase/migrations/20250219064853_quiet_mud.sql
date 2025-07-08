/*
  # Fix Admin Dashboard

  1. Ensure proper table structure
  2. Set up correct RLS policies
  3. Add initial test data
*/

-- Ensure properties table has correct structure
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

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON properties;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON properties;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON properties;

-- Create new policies
CREATE POLICY "Enable read access for all users" 
  ON properties FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for authenticated users" 
  ON properties FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON properties FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON properties FOR DELETE 
  TO authenticated 
  USING (true);

-- Insert test data if table is empty
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
  status,
  listingType,
  description,
  yearBuilt,
  energyClass,
  amenities
)
SELECT
  'Vila de Lux cu Piscină',
  '€750,000',
  'Aradul Nou',
  'house',
  5,
  4,
  '450m²',
  ARRAY['Piscină', 'Grădină', 'Garaj dublu'],
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
  'active',
  'sale',
  'Această vilă impresionantă, situată într-o zonă exclusivistă din Aradul Nou, reprezintă esența luxului și confortului modern.',
  2022,
  'A+',
  ARRAY['Sistem de climatizare centralizat', 'Dressing-uri spațioase', 'Home cinema', 'Sală de fitness', 'Saună']
WHERE NOT EXISTS (
  SELECT 1 FROM properties
);