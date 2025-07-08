/*
  # Fix Timestamp Fields

  1. Changes
    - Add proper handling for NULL timestamp values
    - Set default values for timestamp fields
    - Update existing NULL timestamps to current time

  2. Security
    - Maintains existing security policies
    - No data loss
*/

DO $$ 
BEGIN
  -- Update timestamp columns to have proper defaults and handle NULL values
  ALTER TABLE auth.users 
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now(),
    ALTER COLUMN last_sign_in_at SET DEFAULT now(),
    ALTER COLUMN banned_until DROP NOT NULL,
    ALTER COLUMN email_confirmed_at SET DEFAULT now(),
    ALTER COLUMN phone_confirmed_at DROP NOT NULL,
    ALTER COLUMN confirmation_sent_at DROP NOT NULL,
    ALTER COLUMN email_change_sent_at DROP NOT NULL,
    ALTER COLUMN invited_at DROP NOT NULL,
    ALTER COLUMN reauthentication_sent_at DROP NOT NULL;

  -- Update any existing NULL timestamps to current time
  UPDATE auth.users 
  SET 
    created_at = COALESCE(created_at, now()),
    updated_at = COALESCE(updated_at, now()),
    last_sign_in_at = COALESCE(last_sign_in_at, now()),
    email_confirmed_at = COALESCE(email_confirmed_at, now());

  -- Set other timestamp fields to NULL if they are not set
  UPDATE auth.users 
  SET 
    banned_until = NULL,
    phone_confirmed_at = NULL,
    confirmation_sent_at = NULL,
    email_change_sent_at = NULL,
    invited_at = NULL,
    reauthentication_sent_at = NULL
  WHERE 
    banned_until IS NULL OR
    phone_confirmed_at IS NULL OR
    confirmation_sent_at IS NULL OR
    email_change_sent_at IS NULL OR
    invited_at IS NULL OR
    reauthentication_sent_at IS NULL;

END $$;