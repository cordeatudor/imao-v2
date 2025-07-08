/*
  # Update Property Image

  1. Changes
    - Update image for Apartament Utracentral Banu Maracine
    - Add image to images array
*/

UPDATE properties
SET 
  image = 'https://images.storia.ro/upx-apraise/images/properties/2024/03/28/apartment-ultracentral-banu-maracine.jpg',
  images = ARRAY[
    'https://images.storia.ro/upx-apraise/images/properties/2024/03/28/apartment-ultracentral-banu-maracine.jpg'
  ]
WHERE 
  title = 'Apartament Utracentral Banu Maracine'
  AND location = 'Vlaicu'
  AND listingtype = 'sale'
  AND status = 'active';