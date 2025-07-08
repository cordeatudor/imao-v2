/*
  # Update Admin Password

  1. Changes
    - Updates admin user password to a more secure value
    - Ensures proper password hashing
*/

DO $$ 
BEGIN
  -- Update admin user password
  UPDATE auth.users
  SET encrypted_password = crypt('Admin123!@#', gen_salt('bf'))
  WHERE email = 'admin@imobiliarealtfel.ro';
END $$;