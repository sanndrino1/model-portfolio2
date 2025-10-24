'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';

export interface GalleryImage {
  id: string;
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface GalleryProps {
  images: GalleryImage[];
  columns?: number | { mobile: number; tablet: number; desktop: number };
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  lightbox?: boolean;
  className?: string;
}

export function Gallery({ 
  images, 
  columns = 3, 
  gap = 'md', 
  aspectRatio = 'auto',
  lightbox = true,
  className = '' 
}: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Responsive columns - оптимизирано за по-малки размери
  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${Math.min(columns, 5)}`;
    }
    return `grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
  };

  // Gap classes
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  // Aspect ratio classes - по-малки пропорции
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'aspect-[3/4]' // По-компактен default
  };

  const openLightbox = useCallback((index: number) => {
    if (lightbox) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    }
  }, [lightbox]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="image" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Няма снимки за показване</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${getColumnClasses()} ${gapClasses[gap]} ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${aspectClasses[aspectRatio]} transition-all duration-300 hover:shadow-lg`}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.thumbnail || image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Icon name="eye" className="w-6 h-6 text-white" />
            </div>
            
            {/* Title overlay */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-medium truncate">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox - респонзив оптимизация */}
      {lightbox && lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon name="x" className="w-6 h-6 text-white" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon name="chevron-left" className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon name="chevron-right" className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="relative max-w-[90vw] max-h-[80vh]">
            <Image
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              priority
            />
            
            {/* Image info */}
            {images[currentImageIndex].title && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 text-white">
                <h3 className="font-medium mb-1">{images[currentImageIndex].title}</h3>
                {images[currentImageIndex].description && (
                  <p className="text-sm text-gray-300">{images[currentImageIndex].description}</p>
                )}
              </div>
            )}
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  );
}