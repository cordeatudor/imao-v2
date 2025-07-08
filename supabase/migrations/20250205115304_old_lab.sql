/*
  # Articles Management Setup

  1. New Tables
    - articles table for blog content management
    - Adds required columns for content, metadata, and timestamps
  
  2. Security
    - Enables RLS
    - Sets up appropriate policies for authenticated users
*/

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

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON articles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON articles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON articles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON articles;

-- Create new policies
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

-- Insert sample articles if none exist
INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  image,
  category,
  author
)
SELECT
  'Ghid complet pentru cumpărarea primei case în Arad',
  'buying-guide',
  'Află tot ce trebuie să știi despre procesul de achiziție a unei proprietăți și pașii esențiali pentru o decizie informată.',
  'Achiziționarea primei case este un pas important în viața oricui. Acest ghid vă va ajuta să navigați prin procesul de cumpărare a unei proprietăți în Arad, oferindu-vă informații esențiale și sfaturi practice.',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
  'guide',
  'Alex Popescu'
WHERE NOT EXISTS (
  SELECT 1 FROM articles WHERE slug = 'buying-guide'
);

INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  image,
  category,
  author
)
SELECT
  'Top 5 cartiere în dezvoltare din Arad',
  'developing-neighborhoods',
  'Descoperă zonele cu cel mai mare potențial de creștere și oportunitățile de investiții imobiliare din Arad.',
  'Aradul se dezvoltă constant, iar anumite zone ale orașului prezintă un potențial deosebit pentru investiții imobiliare. Acest articol analizează cele mai promițătoare cartiere în plină dezvoltare.',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
  'analysis',
  'Maria Ionescu'
WHERE NOT EXISTS (
  SELECT 1 FROM articles WHERE slug = 'developing-neighborhoods'
);