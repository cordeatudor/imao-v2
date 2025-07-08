/*
  # Create Admin User with Proper Auth Setup

  1. Changes
    - Removes any existing admin user
    - Creates new admin user with proper auth setup
    - Sets up identity record
    - Ensures email confirmation
    
  2. Security
    - Uses secure password hashing
    - Sets up required metadata
    - Configures proper auth settings
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

  -- Insert new admin user with all required fields
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
    role,
    aud,
    confirmation_sent_at
  ) VALUES (
    new_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@imobiliarealtfel.ro',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    now()
  );

  -- Create identity record with all required fields
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
      'email', 'admin@imobiliarealtfel.ro',
      'email_verified', true
    ),
    'email',
    'admin@imobiliarealtfel.ro',
    now(),
    now(),
    now()
  );
END $$;