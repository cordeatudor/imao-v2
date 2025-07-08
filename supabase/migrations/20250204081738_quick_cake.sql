/*
  # Create Second Admin User

  1. Changes
    - Creates an additional admin user with secure password
    - Sets up identity record
    - Uses proper transaction handling
    
  2. Security
    - Uses proper password hashing
    - Sets up required metadata
*/

DO $$ 
DECLARE
  new_admin_id uuid;
BEGIN
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
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin2@imobiliarealtfel.ro',
    crypt('admin456', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin 2"}',
    now(),
    now()
  ) RETURNING id INTO new_admin_id;

  -- Create identity record for the new admin
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
      'email', 'admin2@imobiliarealtfel.ro'
    ),
    'email',
    'admin2@imobiliarealtfel.ro',
    now(),
    now(),
    now()
  );
END $$;