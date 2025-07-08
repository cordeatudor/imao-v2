/*
  # Update Property Details

  1. Changes
    - Update specific property details with new information
    - Set proper amenities and features
*/

UPDATE properties
SET 
  title = 'Apartament Utracentral Banu Maracine',
  location = 'Vlaicu',
  price = '€43,000',
  beds = 1,
  baths = 1,
  size = '35m²',
  yearbuilt = 1969,
  energyclass = 'B',
  description = 'Apartament complet renovat și mobilat modern, perfect pentru un cuplu tânăr sau ca investiție.',
  features = ARRAY['Renovat complet', 'Mobilat și utilat', 'Balcon închis'],
  amenities = ARRAY['Mobilier nou', 'Electrocasnice incorporate', 'Aer condiționat'],
  type = 'apartment',
  status = 'active',
  listingtype = 'sale'
WHERE 
  type = 'apartment' 
  AND location = 'Vlaicu'
  AND listingtype = 'sale'
  AND status = 'active';