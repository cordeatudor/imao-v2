import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uugptiqxrphgthdljgce.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z3B0aXF4cnBoZ3RoZGxqZ2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTU3MzMsImV4cCI6MjA2Njk3MTczM30.4rFbaGlugvvhbO8hDAoGt9o9WJgPCW_80kU1BGktCk8";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Property interface
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  size: string;
  features: string[];
  image: string;
  images?: string[];
  status: 'active' | 'pending' | 'sold';
  listingtype: 'sale' | 'rent';
  description?: string;
  yearbuilt?: number;
  energyclass?: string;
  amenities?: string[];
  created_at?: string;
  updated_at?: string;
}

// Helper function to load properties
export const loadProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to load properties: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Ensure arrays are properly initialized
    return data.map(property => ({
      ...property,
      features: Array.isArray(property.features) ? property.features : [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      images: Array.isArray(property.images) ? property.images : []
    }));
  } catch (error) {
    console.error('Error loading properties:', error);
    throw error;
  }
};

// Helper function to get public URL for storage items
export const getPublicUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${supabaseUrl}/storage/v1/object/public/property-images/${path}`;
};

// Helper function to upload image to storage
export const uploadImage = async (file: File, bucket: string = 'property-images', folder: string = ''): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// Helper function to delete image from storage
export const deleteImage = async (url: string, bucket: string = 'property-images'): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};