import React from 'react';

interface PropertyTypeProps {
  icon: React.ReactNode;
  title: string;
  count: number;
}

const PropertyType: React.FC<PropertyTypeProps> = ({ icon, title, count }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform hover:scale-[1.02] group">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{count} proprietăți</p>
    </div>
  );
}

export default PropertyType;