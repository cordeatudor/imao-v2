DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@imobiliarealtfel.ro';

  -- Update the password if user exists
  IF admin_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf'))
    WHERE id = admin_user_id;
  END IF;
END $$;