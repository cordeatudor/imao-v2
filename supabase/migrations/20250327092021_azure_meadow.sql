/*
  # Add Rental Properties

  1. Changes
    - Add sample rental properties to the database
    - Include diverse property types
    - Set proper rental prices and details
*/

-- Insert rental properties if they don't exist
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
    'Apartament de Lux în Centru',
    '€1,200/lună',
    'Centru',
    'apartment',
    2,
    1,
    '75m²',
    ARRAY['Mobilat complet', 'Vedere panoramică', 'Parcare'],
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2080&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Apartament modern și elegant, complet mobilat și utilat, situat în inima orașului Arad.',
    2020,
    'A',
    ARRAY['Mobilier modern', 'Electrocasnice premium', 'Internet de mare viteză', 'Smart TV']
  ),
  (
    'Casă Spațioasă cu Grădină',
    '€1,500/lună',
    'Aradul Nou',
    'house',
    4,
    2,
    '180m²',
    ARRAY['Grădină mare', 'Garaj', 'Terasă'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Casă ideală pentru familie, cu grădină generoasă și spații de depozitare.',
    2018,
    'B',
    ARRAY['Sistem de irigație', 'Grătar în curte', 'Magazie pentru unelte']
  ),
  (
    'Studio Modern în Zona UTA',
    '€350/lună',
    'UTA',
    'apartment',
    1,
    1,
    '45m²',
    ARRAY['Mobilat', 'Utilat', 'Balcon'],
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Studio perfect pentru studenți sau tineri profesioniști, aproape de facilitățile orașului.',
    2019,
    'B',
    ARRAY['Aer condiționat', 'Mașină de spălat', 'Frigider nou']
  ),
  (
    'Spațiu Comercial Central',
    '€2,500/lună',
    'Centru',
    'commercial',
    NULL,
    2,
    '120m²',
    ARRAY['Vitrină la stradă', 'Trafic intens', 'Renovată recent'],
    'https://images.unsplash.com/photo-1582037928769-351cc5f1d066?q=80&w=2070&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1582037928769-351cc5f1d066?q=80&w=2070&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Spațiu comercial premium în zona cu cel mai mare trafic pietonal din Arad.',
    2015,
    'A',
    ARRAY['Sistem de ventilație', 'Sistem de alarmă', 'Depozit']
  ),
  (
    'Apartament Executive',
    '€800/lună',
    'Micălaca',
    'apartment',
    3,
    2,
    '85m²',
    ARRAY['Mobilat modern', 'Loc de parcare', 'Balcon mare'],
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2084&auto=format&fit=crop',
    ARRAY[
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2084&auto=format&fit=crop'
    ],
    'active',
    'rent',
    'Apartament spațios și luminos, ideal pentru familii sau profesioniști.',
    2021,
    'A',
    ARRAY['Bucătărie complet utilată', 'Dressing walk-in', 'Sistem smart home']
  )
) AS new_properties
WHERE NOT EXISTS (
  SELECT 1 FROM properties 
  WHERE title IN (
    'Apartament de Lux în Centru',
    'Casă Spațioasă cu Grădină',
    'Studio Modern în Zona UTA',
    'Spațiu Comercial Central',
    'Apartament Executive'
  )
);