/*
  # Update Property Image

  1. Changes
    - Update image URL to use base64 image data
    - Update images array
*/

UPDATE properties
SET 
  image = '/property-images/apartment-banu-maracine.jpg',
  images = ARRAY[
    '/property-images/apartment-banu-maracine.jpg'
  ]
WHERE 
  title = 'Apartament Utracentral Banu Maracine'
  AND location = 'Vlaicu'
  AND listingtype = 'sale'
  AND status = 'active';