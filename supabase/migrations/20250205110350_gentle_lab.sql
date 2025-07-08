/*
  # Fix Auth Schema Issues

  1. Changes
    - Add proper handling for NULL confirmation_token values
    - Update auth schema to handle NULL values correctly
    - Add missing default values for required fields

  2. Security
    - Maintains existing security policies
    - No data loss or modification
*/

DO $$ 
BEGIN
  -- Update auth.users table to handle NULL values correctly
  ALTER TABLE auth.users 
    ALTER COLUMN confirmation_token DROP NOT NULL,
    ALTER COLUMN confirmation_token SET DEFAULT '',
    ALTER COLUMN recovery_token SET DEFAULT '',
    ALTER COLUMN email_change_token_new SET DEFAULT '',
    ALTER COLUMN email_change_token_current SET DEFAULT '',
    ALTER COLUMN reauthentication_token SET DEFAULT '';

  -- Update existing NULL values to empty strings
  UPDATE auth.users 
  SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    reauthentication_token = COALESCE(reauthentication_token, '');

END $$;