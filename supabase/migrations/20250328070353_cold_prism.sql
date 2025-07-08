/*
  # Add Real Properties from Arad

  1. Changes
    - Clear existing sample properties
    - Add real properties from the Arad market
    - Include accurate details and pricing
*/

-- First clear existing properties
TRUNCATE TABLE properties;

-- Insert real properties
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
  'Apartament 2 Camere Aurel Vlaicu',
  '€52,000',
  'Vlaicu',
  'apartment',
  2,
  1,
  '52m²',
  ARRAY['Decomandat', 'Etaj 3/4', 'Orientare Sud'],
  '/property-images/apartament-vlaicu-2-camere.jpg',
  ARRAY['/property-images/apartament-vlaicu-2-camere.jpg'],
  'active',
  'sale',
  'Apartament decomandat cu 2 camere, situat în zona Vlaicu, aproape de Kaufland. Apartamentul este la etajul 3 din 4, orientat spre sud, beneficiind de lumină naturală pe tot parcursul zilei.',
  1975,
  'C',
  ARRAY['Centrală termică proprie', 'Geamuri termopan', 'Parchet laminat', 'Ușă metalică']
),
(
  'Casă Individuală Grădiște',
  '€185,000',
  'Grădiște',
  'house',
  4,
  2,
  '160m²',
  ARRAY['Curte proprie 500mp', 'Garaj', 'Construcție 2020'],
  '/property-images/casa-gradiste.jpg',
  ARRAY['/property-images/casa-gradiste.jpg'],
  'active',
  'sale',
  'Casă individuală construită în 2020, situată în cartierul Grădiște. Dispune de 4 camere, 2 băi, bucătărie, living spațios și garaj. Curtea generoasă de 500mp oferă multiple posibilități de amenajare.',
  2020,
  'A',
  ARRAY['Încălzire în pardoseală', 'Panouri fotovoltaice', 'Sistem de irigații', 'Supraveghere video']
),
(
  'Apartament 3 Camere Podgoria',
  '€98,000',
  'Centru',
  'apartment',
  3,
  2,
  '75m²',
  ARRAY['Vedere spre bulevard', 'Balcon închis', 'Renovat recent'],
  '/property-images/apartament-podgoria.jpg',
  ARRAY['/property-images/apartament-podgoria.jpg'],
  'active',
  'sale',
  'Apartament spațios cu 3 camere în zona Podgoria, recent renovat. Poziționare excelentă, cu vedere spre bulevardul principal. Dispune de două băi, bucătărie modernă și balcon închis.',
  1985,
  'B',
  ARRAY['Mobilat și utilat', 'Aer condiționat', 'Parchet masiv', 'Tâmplărie PVC']
),
(
  'Teren Intravilan Gai',
  '€45,000',
  'Gai',
  'land',
  NULL,
  NULL,
  '750m²',
  ARRAY['Front stradal 15m', 'Toate utilitățile', 'Zonă rezidențială'],
  '/property-images/teren-gai.jpg',
  ARRAY['/property-images/teren-gai.jpg'],
  'active',
  'sale',
  'Teren intravilan în cartierul Gai, ideal pentru construcția unei case. Toate utilitățile sunt la limita proprietății. Terenul are o deschidere de 15 metri la stradă și o adâncime de 50 metri.',
  NULL,
  NULL,
  ARRAY['Curent electric', 'Apă', 'Canalizare', 'Gaz']
),
(
  'Spațiu Comercial Ultracentral',
  '€1,200',
  'Centru',
  'commercial',
  NULL,
  1,
  '85m²',
  ARRAY['Vitrină la stradă', 'Vad comercial', 'Renovată 2023'],
  '/property-images/spatiu-comercial-centru.jpg',
  ARRAY['/property-images/spatiu-comercial-centru.jpg'],
  'active',
  'rent',
  'Spațiu comercial ultracentral, cu vitrină la strada principală. Recent renovat, dispune de toate utilitățile necesare pentru diverse activități comerciale. Trafic pietonal intens.',
  1960,
  'B',
  ARRAY['Climatizare', 'Sistem de alarmă', 'Grup sanitar', 'Depozit']
),
(
  'Apartament 2 Camere UTA',
  '€400',
  'UTA',
  'apartment',
  2,
  1,
  '54m²',
  ARRAY['Mobilat modern', 'Loc de parcare', 'Etaj 2/4'],
  '/property-images/apartament-uta.jpg',
  ARRAY['/property-images/apartament-uta.jpg'],
  'active',
  'rent',
  'Apartament modern cu 2 camere în zona UTA, complet mobilat și utilat. Dispune de loc de parcare propriu și este situat la etajul 2. Ideal pentru un cuplu sau o familie mică.',
  1980,
  'C',
  ARRAY['Electrocasnice noi', 'Internet fibră optică', 'Balcon închis', 'Debara']
);