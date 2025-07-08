/*
  # Update Property Image URL

  1. Changes
    - Update image URL to use optimized version
    - Update images array with optimized version
*/

UPDATE properties
SET 
  image = 'https://i.imgur.com/YwJ4E5L.jpg',
  images = ARRAY[
    'https://i.imgur.com/YwJ4E5L.jpg'
  ]
WHERE 
  title = 'Apartament Utracentral Banu Maracine'
  AND location = 'Vlaicu'
  AND listingtype = 'sale'
  AND status = 'active';