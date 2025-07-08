/*
  # Reset Database

  1. Changes
    - Drop all existing tables
    - Remove existing RLS policies
    - Remove existing admin users
    
  2. Security
    - Clean database state for fresh start
*/

-- Drop existing tables
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS articles CASCADE;

-- Drop existing storage
DO $$
BEGIN
  -- Drop storage bucket if it exists
  IF EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'property-images'
  ) THEN
    DELETE FROM storage.objects WHERE bucket_id = 'property-images';
    DELETE FROM storage.buckets WHERE id = 'property-images';
  END IF;
END $$;

-- Remove existing admin users
DO $$
BEGIN
  -- Delete all identities
  DELETE FROM auth.identities;
  
  -- Delete all users
  DELETE FROM auth.users;
END $$;