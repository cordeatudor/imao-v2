DO $$ 
DECLARE
  new_admin_id uuid;
BEGIN
  -- First remove any existing admin users
  DELETE FROM auth.identities
  WHERE provider_id IN ('admin@imobiliarealtfel.ro', 'admin2@imobiliarealtfel.ro');
  
  DELETE FROM auth.users
  WHERE email IN ('admin@imobiliarealtfel.ro', 'admin2@imobiliarealtfel.ro');

  -- Generate new UUID for admin user
  new_admin_id := gen_random_uuid();

  -- Insert new admin user with a properly hashed password
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
    confirmation_token,
    recovery_token,
    is_sso_user,
    email_change_token_new,
    email_change_token_current,
    phone_change_token,
    reauthentication_token,
    is_anonymous,
    last_sign_in_at,
    confirmation_sent_at,
    invited_at,
    phone_confirmed_at,
    email_change_confirm_status,
    banned_until,
    reauthentication_sent_at
  ) VALUES (
    new_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@imobiliarealtfel.ro',
    crypt('admin123', gen_salt('bf', 10)), -- Using stronger password hashing
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email']
    ),
    jsonb_build_object(
      'name', 'Admin'
    ),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '',
    '',
    false,
    '',
    '',
    '',
    '',
    false,
    now(),
    now(),
    now(),
    now(),
    0,
    null,
    now()
  );

  -- Create identity record with proper metadata
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
      'email_verified', true,
      'phone_verified', false,
      'aud', 'authenticated'
    ),
    'email',
    'admin@imobiliarealtfel.ro',
    now(),
    now(),
    now()
  );
END $$;