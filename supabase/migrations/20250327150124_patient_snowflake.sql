/*
  # Add Custom Properties

  1. Changes
    - Add new properties to the database
    - Include both sale and rental properties
    - Set proper details and amenities
*/

-- Insert custom properties if they don't exist
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
)
SELECT * FROM (VALUES
  (
    'Apartament Ultramodern Vlaicu',
    '€125,000',
    'Vlaicu',
    'apartment',
    2,
    1,
    '65m²',
    ARRAY['Renovat complet', 'Mobilat și utilat', 'Balcon închis'],
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'sale',
    'Apartament complet renovat și mobilat modern, perfect pentru un cuplu tânăr sau ca investiție.',
    2010,
    'B',
    ARRAY['Mobilier nou', 'Electrocasnice incorporate', 'Aer condiționat']
  ),
  (
    'Casă cu Grădină în Grădiște',
    '€195,000',
    'Grădiște',
    'house',
    4,
    2,
    '150m²',
    ARRAY['Grădină mare', 'Garaj', 'Foișor'],
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'sale',
    'Casă spațioasă cu grădină generoasă, perfectă pentru o familie care își dorește liniște și spațiu verde.',
    2015,
    'B',
    ARRAY['Încălzire în pardoseală', 'Sistem de irigații', 'Magazie']
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
  ),
  (
    'Spațiu Birou Centru',
    '€800/lună',
    'Centru',
    'commercial',
    NULL,
    1,
    '80m²',
    ARRAY['Open space', 'Recepție', 'Bucătărie'],
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Spațiu de birou modern în centrul orașului, perfect pentru o companie mică sau startup.',
    2019,
    'A',
    ARRAY['Aer condiționat', 'Sistem de acces cu cartelă', 'Internet de mare viteză']
  )
) AS new_properties
WHERE NOT EXISTS (
  SELECT 1 FROM properties 
  WHERE title IN (
    'Apartament Ultramodern Vlaicu',
    'Casă cu Grădină în Grădiște',
    'Apartament Modern Podgoria',
    'Spațiu Birou Centru'
  )
);