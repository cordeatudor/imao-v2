/*
  # Update admin user ID safely

  1. Changes
    - Safely updates the admin user ID by first removing any conflicting records
    - Updates related identity records
*/

DO $$ 
BEGIN
  -- First, delete any existing identity records for the target user
  DELETE FROM auth.identities 
  WHERE user_id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6'
  OR id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6';

  -- Then delete any existing user with the target ID
  DELETE FROM auth.users 
  WHERE id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6';

  -- Now we can safely update the admin user
  WITH updated_user AS (
    UPDATE auth.users
    SET id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6'
    WHERE email = 'admin@imobiliarealtfel.ro'
    RETURNING id
  )
  UPDATE auth.identities
  SET 
    id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6',
    user_id = 'dbef192c-ee92-431e-8b1a-2ae4189311b6',
    identity_data = format('{"sub":"%s","email":"%s"}', 'dbef192c-ee92-431e-8b1a-2ae4189311b6', 'admin@imobiliarealtfel.ro')::jsonb
  WHERE provider = 'email' 
  AND provider_id = 'admin@imobiliarealtfel.ro';
END $$;