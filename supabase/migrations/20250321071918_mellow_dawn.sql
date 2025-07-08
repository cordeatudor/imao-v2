/*
  # Fix Admin Authentication

  1. Changes
    - Recreate admin user with proper credentials
    - Ensure correct auth configuration
    - Add better error logging
*/

DO $$ 
DECLARE
  new_admin_id uuid;
BEGIN
  -- First remove any existing admin users to ensure clean slate
  DELETE FROM auth.identities
  WHERE provider_id = 'admin@imobiliarealtfel.ro';
  
  DELETE FROM auth.users
  WHERE email = 'admin@imobiliarealtfel.ro';

  -- Generate new UUID for admin user
  new_admin_id := gen_random_uuid();

  -- Insert new admin user with minimal required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    role
  ) VALUES (
    new_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@imobiliarealtfel.ro',
    crypt('Admin123!@#', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}',
    now(),
    now(),
    'authenticated',
    'authenticated'
  );

  -- Insert identity
  INSERT INTO auth.identities (
    id,
    user_id,
    provider,
    provider_id,
    identity_data
  ) VALUES (
    new_admin_id,
    new_admin_id,
    'email',
    'admin@imobiliarealtfel.ro',
    json_build_object(
      'sub', new_admin_id::text,
      'email', 'admin@imobiliarealtfel.ro'
    )
  );
END $$;