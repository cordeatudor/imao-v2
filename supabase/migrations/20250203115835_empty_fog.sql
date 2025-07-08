/*
  # Insert Initial Properties

  1. Data Population
    - Adds initial property listings to the properties table
    - Includes sample properties with complete details
    - Sets up active listings for both sale and rent

  2. Properties Added
    - Luxury Villa with Pool
    - Exclusive Penthouse
    - Modern House with Garden
*/

-- Insert Vila de Lux cu Piscină
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
) VALUES (
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
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop'
  ],
  'active',
  'sale',
  'Această vilă impresionantă, situată într-o zonă exclusivistă din Aradul Nou, reprezintă esența luxului și confortului modern.',
  2022,
  'A+',
  ARRAY['Sistem de climatizare centralizat', 'Dressing-uri spațioase', 'Home cinema', 'Sală de fitness', 'Saună']
);

-- Insert Penthouse Exclusivist
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
) VALUES (
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
    'https://images.unsplash.com/photo-1600607687126-c2d22673c16d?q=80&w=2053&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2053&auto=format&fit=crop'
  ],
  'active',
  'sale',
  'Acest penthouse spectaculos, situat în inima orașului Arad, oferă o experiență de viață la înălțime cu priveliști panoramice impresionante asupra orașului.',
  2023,
  'A',
  ARRAY['Încălzire în pardoseală', 'Aer condiționat centralizat', 'Sistem audio multi-room', 'Electrocasnice premium']
);

-- Insert Casă Modernă cu Grădină
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
) VALUES (
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
);