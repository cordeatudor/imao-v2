import React from 'react';
import * as Icons from 'lucide-react';
import { Property } from '../../lib/supabase';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onEdit(property)}
    >
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'active'
                ? 'bg-green-100 text-green-800'
                : property.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {property.status === 'active' ? 'Active' : 
             property.status === 'pending' ? 'Pending' : 'Sold'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-purple-600 font-bold">{property.price}</span>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Icons.Trash2 size={20} />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Icons.Bed size={16} />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Bath size={16} />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Square size={16} />
            <span>{property.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;