/*
  # Delete specific user

  1. Changes
    - Safely delete user with ID d9595f9e-2628-4e67-b645-1485a5eb3b29
    - Remove associated identity records
    - Ensure clean removal from auth system
*/

DO $$ 
BEGIN
  -- First delete any identity records for this user
  DELETE FROM auth.identities 
  WHERE user_id = 'd9595f9e-2628-4e67-b645-1485a5eb3b29';

  -- Then delete the user
  DELETE FROM auth.users 
  WHERE id = 'd9595f9e-2628-4e67-b645-1485a5eb3b29';
END $$;