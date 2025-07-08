import React from 'react';
import * as Icons from 'lucide-react';

interface RecommendedArticleProps {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const RecommendedArticle: React.FC<RecommendedArticleProps> = ({
  image,
  title,
  excerpt,
  date,
  readTime,
  category
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-sm">
          {category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Icons.Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Clock size={16} />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendedArticle;