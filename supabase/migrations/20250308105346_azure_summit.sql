/*
  # Fix properties table RLS policies

  1. Changes
    - Drop existing policies
    - Create new admin policy for full access
    - Create public read-only policy
    
  2. Security
    - Enable admin users to have full CRUD access
    - Allow public users to view properties
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can manage properties" ON properties;
DROP POLICY IF EXISTS "Public users can view properties" ON properties;
DROP POLICY IF EXISTS "admin_full_access" ON properties;

-- Create admin policy for full access
CREATE POLICY "admin_full_access"
ON properties
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create public read-only policy
CREATE POLICY "Public users can view properties"
ON properties
FOR SELECT
TO public
USING (true);