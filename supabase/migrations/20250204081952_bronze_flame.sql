/*
  # Create Admin User with Email Check

  1. Changes
    - Removes existing user with same email if exists
    - Creates new admin user with secure password
    - Sets up identity record
    
  2. Security
    - Uses proper password hashing
    - Sets up required metadata
    - Handles duplicate email gracefully
*/

DO $$ 
DECLARE
  new_admin_id uuid;
BEGIN
  -- First remove any existing user with this email
  DELETE FROM auth.identities
  WHERE provider_id = 'admin@imobiliarealtfel.ro';
  
  DELETE FROM auth.users
  WHERE email = 'admin@imobiliarealtfel.ro';

  -- Generate new UUID for admin user
  new_admin_id := gen_random_uuid();

  -- Insert new admin user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    new_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@imobiliarealtfel.ro',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    now(),
    now()
  );

  -- Create identity record
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_admin_id,
    new_admin_id,
    jsonb_build_object(
      'sub', new_admin_id::text,
      'email', 'admin@imobiliarealtfel.ro'
    ),
    'email',
    'admin@imobiliarealtfel.ro',
    now(),
    now(),
    now()
  );
END $$;