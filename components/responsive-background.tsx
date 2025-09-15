'use client';

import { useEffect, useState } from 'react';

interface ResponsiveBackgroundProps {
  imageSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ResponsiveBackground({ 
  imageSrc, 
  alt, 
  className = '', 
  style = {},
  children 
}: ResponsiveBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = imageSrc;
  }, [imageSrc]);

  if (imageError) {
    return (
      <div className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          ...style
        }}
        aria-label={alt}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
      )}
      
      {/* Content */}
      {children}
    </div>
  );
}
