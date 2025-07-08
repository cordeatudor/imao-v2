/*
  # Reset and Add Sample Properties

  1. Changes
    - Clear existing properties
    - Add new sample properties with correct data structure
    - Ensure proper image paths
*/

-- First clear existing properties
TRUNCATE TABLE properties;

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
  '/property-images/vila-lux-piscina.jpg',
  ARRAY['/property-images/vila-lux-piscina.jpg'],
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
  '/property-images/penthouse-exclusivist.jpg',
  ARRAY['/property-images/penthouse-exclusivist.jpg'],
  'active',
  'sale',
  'Acest penthouse spectaculos, situat în inima orașului Arad, oferă o experiență de viață la înălțime cu priveliști panoramice impresionante asupra orașului.',
  2023,
  'A',
  ARRAY['Încălzire în pardoseală', 'Aer condiționat centralizat', 'Sistem audio multi-room', 'Electrocasnice premium']
),
(
  'Apartament Ultracentral Banu Maracine',
  '€43,000',
  'Vlaicu',
  'apartment',
  1,
  1,
  '35m²',
  ARRAY['Renovat complet', 'Mobilat și utilat', 'Balcon închis'],
  '/property-images/banu-maracine-living.jpg',
  ARRAY['/property-images/banu-maracine-living.jpg'],
  'active',
  'sale',
  'Apartament complet renovat și mobilat modern, perfect pentru un cuplu tânăr sau ca investiție.',
  1969,
  'B',
  ARRAY['Mobilier nou', 'Electrocasnice incorporate', 'Aer condiționat']
);