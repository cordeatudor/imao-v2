import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  onImageSelect: (file: File, url?: string) => void;
  onImageClear?: () => void;
  preview?: string;
  className?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  uploadToStorage?: boolean;
  storagePath?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageClear,
  preview,
  className = '',
  label = 'Încarcă imagine',
  accept = 'image/jpeg,image/png',
  maxSize = 5, // 5MB default
  uploadToStorage = false,
  storagePath = 'property-images'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setError('Doar fișiere JPEG sau PNG sunt acceptate');
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Fișierul trebuie să fie mai mic de ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${storagePath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        setError('Eroare la încărcarea imaginii. Încercați din nou.');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setError('Eroare la încărcarea imaginii. Încercați din nou.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      if (uploadToStorage) {
        const url = await uploadToSupabase(file);
        if (url) {
          onImageSelect(file, url);
        }
      } else {
        onImageSelect(file);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      if (uploadToStorage) {
        const url = await uploadToSupabase(file);
        if (url) {
          onImageSelect(file, url);
        }
      } else {
        onImageSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
              <div className="flex items-center gap-2 text-white">
                <Icons.Loader2 className="animate-spin" size={20} />
                <span>Se încarcă...</span>
              </div>
            </div>
          )}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          {onImageClear && (
            <button
              onClick={onImageClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              title="Șterge imaginea"
            >
              <Icons.X size={20} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`${
            isUploading ? 'pointer-events-none opacity-50' : ''
          }
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-500'
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <Icons.Loader2 
                size={40} 
                className="text-purple-500 animate-spin"
              />
            ) : (
              <Icons.Upload 
                size={40} 
                className={`
                  ${isDragging ? 'text-purple-500' : 'text-gray-400'}
                `}
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isUploading ? 'Se încarcă imaginea...' : label}
              </p>
              {!isUploading && (
                <>
                  <p className="text-xs text-gray-500 mt-1">
                    sau trage și plasează un fișier aici
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG sau PNG, max {maxSize}MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <Icons.AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;