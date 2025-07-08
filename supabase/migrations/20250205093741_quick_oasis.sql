DO $$ 
BEGIN
  -- First delete any identity records for this user
  DELETE FROM auth.identities 
  WHERE provider_id = 'admin2@imobiliarealtfel.ro';
  
  -- Then delete the user
  DELETE FROM auth.users 
  WHERE email = 'admin2@imobiliarealtfel.ro';
END $$;