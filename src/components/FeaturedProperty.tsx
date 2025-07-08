import React from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getPublicUrl } from '../lib/supabase';

interface FeaturedPropertyProps {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  size: string;
  features?: string[];
}

const FeaturedProperty: React.FC<FeaturedPropertyProps> = ({
  id,
  image,
  title,
  price,
  location,
  beds,
  baths,
  size,
  features = []
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proprietate/${id}`);
  };

  // Get public URL if image is a storage path
  const imageUrl = image.startsWith('/') ? getPublicUrl(image.slice(1)) : image;

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold shadow-lg">
          {price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-700 transition-colors">{title}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Icons.MapPin size={18} />
          <span>{location}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Icons.Bed size={20} />
            <span>{beds} {t('propertyList.bedrooms')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Bath size={20} />
            <span>{baths} {t('propertyList.bathrooms')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Square size={20} />
            <span>{size}</span>
          </div>
        </div>
        {features.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedProperty;