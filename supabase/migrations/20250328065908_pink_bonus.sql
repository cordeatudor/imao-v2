/*
  # Update Property Image

  1. Changes
    - Update image path for Banu Maracine apartment
    - Set correct image path in database
*/

UPDATE properties
SET 
  image = '/property-images/banu-maracine-living.jpg',
  images = ARRAY[
    '/property-images/banu-maracine-living.jpg'
  ]
WHERE 
  title = 'Apartament Utracentral Banu Maracine'
  AND location = 'Vlaicu'
  AND listingtype = 'sale'
  AND status = 'active';