/*
  # Update Property Image URL

  1. Changes
    - Update image URL to use direct link
    - Update images array with the same image
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