/*
  # Storage Bucket Setup for Property Images
  
  1. Creates storage bucket for property images
  2. Sets up RLS policies for secure access
  3. Configures size limits and access controls
*/

-- Create storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the storage bucket
CREATE POLICY "Give public access to property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Allow authenticated users to upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    (length(name) < 100) AND
    (octet_length(COALESCE(metadata->>'content', '')) < 5242880)
  );

CREATE POLICY "Allow authenticated users to update their property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images');

CREATE POLICY "Allow authenticated users to delete their property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');