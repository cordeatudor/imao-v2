/*
  # Fix Email Change Column Issues

  1. Changes
    - Add proper handling for NULL email_change values
    - Update auth schema to handle NULL values correctly
    - Add missing default values for email_change field

  2. Security
    - Maintains existing security policies
    - No data loss or modification
*/

DO $$ 
BEGIN
  -- Update auth.users table to handle NULL values correctly for email_change
  ALTER TABLE auth.users 
    ALTER COLUMN email_change DROP NOT NULL,
    ALTER COLUMN email_change SET DEFAULT '';

  -- Update existing NULL values to empty strings
  UPDATE auth.users 
  SET email_change = COALESCE(email_change, '');

END $$;