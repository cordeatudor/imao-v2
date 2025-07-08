import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Property } from '../../lib/supabase';
import ImageUpload from '../ImageUpload';

interface PropertyFormProps {
  property: Partial<Property>;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (property: Partial<Property>) => void;
  mode: 'add' | 'edit';
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  onChange,
  mode
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(property.image || null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    // Don't update property.image yet - this will be handled during form submission
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    onChange({ ...property, image: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'add' ? 'Adaugă Proprietate Nouă' : 'Editare Proprietate'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icons.X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagine Principală <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageClear={imagePreview ? handleImageClear : undefined}
                preview={imagePreview || undefined}
                className="mb-4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titlu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={property.title || ''}
                  onChange={e => onChange({ ...property, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preț <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={property.price || ''}
                  onChange={e => onChange({ ...property, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locație <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={property.location || ''}
                  onChange={e => onChange({ ...property, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip Proprietate
                </label>
                <select
                  value={property.type || 'house'}
                  onChange={e => onChange({ ...property, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="house">Casă</option>
                  <option value="apartment">Apartament</option>
                  <option value="land">Teren</option>
                  <option value="commercial">Spațiu Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitoare
                </label>
                <input
                  type="number"
                  value={property.beds || ''}
                  onChange={e => onChange({ ...property, beds: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Băi
                </label>
                <input
                  type="number"
                  value={property.baths || ''}
                  onChange={e => onChange({ ...property, baths: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suprafață
                </label>
                <input
                  type="text"
                  value={property.size || ''}
                  onChange={e => onChange({ ...property, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="ex: 120m²"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip Listare
                </label>
                <select
                  value={property.listingtype || 'sale'}
                  onChange={e => onChange({ ...property, listingtype: e.target.value as 'sale' | 'rent' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="sale">De Vânzare</option>
                  <option value="rent">De Închiriat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={property.status || 'active'}
                  onChange={e => onChange({ ...property, status: e.target.value as 'active' | 'pending' | 'sold' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Activ</option>
                  <option value="pending">În așteptare</option>
                  <option value="sold">Vândut</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descriere
              </label>
              <TextareaAutosize
                value={property.description || ''}
                onChange={e => onChange({ ...property, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                minRows={4}
                placeholder="Descriere detaliată a proprietății"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={onSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                {mode === 'add' ? (
                  <>
                    <Icons.Plus size={20} />
                    Adaugă Proprietate
                  </>
                ) : (
                  <>
                    <Icons.Save size={20} />
                    Salvează Modificările
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;