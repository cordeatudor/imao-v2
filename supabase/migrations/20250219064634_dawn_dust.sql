/*
  # Fix Admin Authentication

  1. Create admin user
  2. Set up proper RLS policies
  3. Configure database roles
*/

-- First ensure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create admin user if not exists
DO $$ 
DECLARE
  admin_uid uuid;
BEGIN
  -- Generate UUID for admin user
  admin_uid := gen_random_uuid();

  -- Insert admin user if not exists
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
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
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@imobiliarealtfel.ro'
  );

  -- Create identity for admin user
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
    jsonb_build_object(
      'sub', admin_uid::text,
      'email', 'admin@imobiliarealtfel.ro',
      'email_verified', true
    ),
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

-- Ensure RLS is enabled on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties table
CREATE POLICY "Enable read access for all users" 
  ON properties FOR SELECT 
  USING (true);

CREATE POLICY "Enable write access for authenticated users" 
  ON properties FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON properties FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON properties FOR DELETE 
  TO authenticated 
  USING (true);

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON properties TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;