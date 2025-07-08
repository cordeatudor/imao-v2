/*
  # Create admin user

  1. Changes
    - Creates admin user with email/password authentication
    - Sets up necessary auth configuration
*/

-- Create admin user with email/password
DO $$ 
DECLARE 
  admin_uid uuid;
BEGIN
  -- Generate UUID for admin user
  admin_uid := gen_random_uuid();

  -- Insert into auth.users if not exists
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  )
  SELECT
    admin_uid,
    'admin@imobiliarealtfel.ro',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}',
    false,
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@imobiliarealtfel.ro'
  );

  -- Insert into auth.identities if not exists
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  SELECT
    admin_uid,
    admin_uid,
    format('{"sub":"%s","email":"%s"}', admin_uid::text, 'admin@imobiliarealtfel.ro')::jsonb,
    'email',
    'admin@imobiliarealtfel.ro',
    now(),
    now(),
    now()
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE provider = 'email' AND provider_id = 'admin@imobiliarealtfel.ro'
  );
END $$;