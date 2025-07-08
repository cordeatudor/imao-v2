import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Poți încărca maximum ${maxImages} imagini`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      onImagesChange([...images, ...validUrls]);
    } catch (err) {
      setError('Eroare la încărcarea imaginilor');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagini Suplimentare ({images.length}/{maxImages})
        </label>
        
        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            id="multi-image-upload"
            disabled={isUploading || images.length >= maxImages}
          />
          <label
            htmlFor="multi-image-upload"
            className={`
              inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg
              text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
              cursor-pointer transition-colors
              ${isUploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isUploading ? (
              <>
                <Icons.Loader2 className="animate-spin" size={16} />
                Se încarcă...
              </>
            ) : (
              <>
                <Icons.Plus size={16} />
                Adaugă Imagini
              </>
            )}
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-sm text-red-600 flex items-center gap-1">
          <Icons.AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt={`Imagine ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      title="Mută la stânga"
                    >
                      <Icons.ChevronLeft size={16} />
                    </button>
                  )}
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      title="Mută la dreapta"
                    >
                      <Icons.ChevronRight size={16} />
                    </button>
                  )}
                  
                  {/* Delete */}
                  <button
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    title="Șterge imaginea"
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Image Number */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className="mt-2 text-xs text-gray-500">
        Prima imagine va fi folosită ca imagine principală. Poți reordona imaginile folosind săgețile.
      </p>
    </div>
  );
};

export default MultiImageUpload;