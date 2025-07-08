import React from 'react';
import * as Icons from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onLogoClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '', onLogoClick }) => {
  const sizes = {
    small: {
      icon: 24,
      title: 'text-sm',
      tagline: 'text-[10px]'
    },
    medium: {
      icon: 32,
      title: 'text-base',
      tagline: 'text-xs'
    },
    large: {
      icon: 40,
      title: 'text-xl',
      tagline: 'text-sm'
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 ${className} group cursor-pointer`}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="relative flex items-center justify-center p-1.5 bg-white/10 rounded-xl transition-all duration-300 group-hover:bg-white/20">
          <Icons.Building2 
            size={sizes[size].icon} 
            className="text-white z-10 transition-transform duration-300 group-hover:scale-105" 
            strokeWidth={1.5}
          />
          <Icons.Home 
            size={sizes[size].icon * 0.7} 
            className="text-yellow-400 absolute -left-1 -bottom-1 opacity-80 transition-all duration-300 group-hover:opacity-90 group-hover:-translate-x-0.5" 
            strokeWidth={1.5}
          />
          <Icons.TreePine 
            size={sizes[size].icon * 0.5} 
            className="text-green-400 absolute -right-1 -bottom-1 opacity-70 transition-all duration-300 group-hover:opacity-90 group-hover:translate-x-0.5" 
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 mix-blend-overlay rounded-xl transition-opacity duration-300 group-hover:opacity-20" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className={`font-bold ${sizes[size].title} flex flex-col leading-none`}>
          <span className="text-center tracking-tight text-white/90">
            Imobiliare
          </span>
          <span className="text-yellow-400 tracking-wider font-black text-lg group-hover:scale-105 transition-transform duration-300">
            ALTFEL
          </span>
        </div>
        <span className={`${sizes[size].tagline} text-purple-200 italic tracking-tight opacity-90 -mt-0.5`}>
          Premium different real estate
        </span>
      </div>
    </div>
  );
};

export default Logo;