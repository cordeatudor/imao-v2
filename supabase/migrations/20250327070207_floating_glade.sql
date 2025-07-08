/*
  # Add Sample Properties

  1. Changes
    - Insert sample properties into the properties table
    - Include variety of property types and features
    - Add realistic property details
*/

-- Insert sample properties if they don't exist
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
  ),
  (
    'Casă Modernă cu Grădină',
    '€385,000',
    'Micălaca',
    'house',
    4,
    2,
    '180m²',
    ARRAY['Grădină amenajată', 'Sistem smart', 'Garaj'],
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
    ],
    'active',
    'sale',
    'Casă modernă cu design contemporan, situată într-o zonă liniștită din Micălaca.',
    2021,
    'A',
    ARRAY['Sistem smart home', 'Panouri solare', 'Grădină amenajată', 'Garaj pentru două mașini']
  ),
  (
    'Apartament Premium',
    '€225,000',
    'Centru',
    'apartment',
    3,
    2,
    '95m²',
    ARRAY['Renovat recent', 'Mobilat complet', 'Loc de parcare'],
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'sale',
    'Apartament premium, complet renovat și mobilat, situat în zona centrală a Aradului.',
    2020,
    'A',
    ARRAY['Mobilier de lux', 'Electrocasnice noi', 'Sistem de securitate']
  ),
  (
    'Teren pentru Dezvoltare',
    '€150,000',
    'Aradul Nou',
    'land',
    NULL,
    NULL,
    '1200m²',
    ARRAY['Zonă rezidențială', 'Toate utilitățile', 'Front stradal 20m'],
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2069&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2069&auto=format&fit=crop'
    ],
    'active',
    'sale',
    'Teren ideal pentru dezvoltare rezidențială, cu toate utilitățile la limita proprietății.',
    NULL,
    NULL,
    ARRAY['Certificat urbanism', 'PUZ aprobat', 'Acces asfaltat']
  )
) AS new_properties
WHERE NOT EXISTS (
  SELECT 1 FROM properties 
  WHERE title IN ('Vila de Lux cu Piscină', 'Penthouse Exclusivist', 'Casă Modernă cu Grădină', 'Apartament Premium', 'Teren pentru Dezvoltare')
);