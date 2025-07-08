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
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for authenticated users to manage properties
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
  listingType text NOT NULL,
  description text,
  yearBuilt integer,
  energyClass text,
  amenities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable full access for authenticated users"
  ON properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);