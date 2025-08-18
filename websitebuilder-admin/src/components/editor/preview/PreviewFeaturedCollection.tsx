/**
 * @file PreviewFeaturedCollection.tsx
 * @max-lines 400
 * @module FeaturedCollection
 * @description Componente Preview UNIFICADO para editor y preview real
 * @unified-architecture true
 * @created 2025-08-17
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import { FeaturedCollectionConfig } from '@/components/editor/modules/FeaturedCollection/types';

interface PreviewFeaturedCollectionProps {
  config: FeaturedCollectionConfig;
  theme?: any;  // Theme desde API en preview real
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;  // CRÍTICO: Diferencia entre contextos
}

// Mock data para desarrollo
const mockItems = [
  {
    id: 1,
    title: 'Habitación Junior',
    price: 1500.00,
    comparePrice: 2000.00,
    currency: 'USD',
    image: '/placeholder-room-1.jpg',
    rating: 4.5,
    reviewCount: 12,
    discount: 25,
    available: true
  },
  {
    id: 2,
    title: 'Deluxe',
    price: 4700.00,
    comparePrice: 6500.00,
    currency: 'USD',
    image: '/placeholder-room-2.jpg',
    rating: 4.5,
    reviewCount: 8,
    discount: 15,
    available: true
  },
  {
    id: 3,
    title: 'Presidencial',
    price: 7500.00,
    comparePrice: 8500.00,
    currency: 'USD',
    image: '/placeholder-room-3.jpg',
    rating: 4.5,
    reviewCount: 5,
    discount: 12,
    available: false
  }
];

export default function PreviewFeaturedCollection({ 
  config, 
  theme,
  deviceView,
  isEditor = false
}: PreviewFeaturedCollectionProps) {
  
  // 🎯 PATRÓN DUAL: Theme desde prop (preview real) o store (editor)
  const storeThemeConfig = useThemeConfigStore(state => state.config);
  const themeConfig = theme || storeThemeConfig;
  
  // ⚠️ DETECCIÓN MÓVIL OBLIGATORIA
  const [isMobile, setIsMobile] = useState(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  
  // Sincronizar con cambios de deviceView o viewport
  useEffect(() => {
    const checkMobile = () => {
      if (deviceView !== undefined) {
        setIsMobile(deviceView === 'mobile');
        return;
      }
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [deviceView]);
  
  // Obtener color scheme seleccionado
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) {
      return {
        text: { default: '#000000' },
        background: { default: '#FFFFFF' },
        solidButton: { default: '#000000' },
        solidButtonText: { default: '#FFFFFF' },
        outlineButton: { default: '#000000' },
        outlineButtonText: { default: '#000000' },
      };
    }
    
    const schemeIndex = parseInt(config.colorScheme || '1') - 1;
    return themeConfig.colorSchemes.schemes[schemeIndex] || themeConfig.colorSchemes.schemes[0];
  }, [themeConfig, config.colorScheme]);
  
  // TODOS LOS HOOKS ANTES DE RETURNS CONDICIONALES
  
  // Validación DESPUÉS de todos los hooks
  if (!config?.enabled && !isEditor) {
    return null;
  }
  
  // Clases responsive basadas en isMobile
  const containerClass = isMobile ? 'px-4' : 'px-8';
  const textSize = isMobile ? 'text-sm' : 'text-base';
  const spacing = isMobile ? 'gap-2' : 'gap-4';
  
  // Width basado en configuración
  const widthClasses = {
    small: 'max-w-3xl mx-auto',
    medium: 'max-w-5xl mx-auto',
    large: 'max-w-6xl mx-auto',
    page: 'max-w-7xl mx-auto',
  };
  
  // Determine columns based on config and device
  const getColumns = () => {
    if (isMobile) {
      if (config.mobileLayout === 'carousel') return 1;
      if (config.mobileLayout === 'twoColumn') return 2;
      return 1;
    }
    return config.desktopColumns || 3;
  };
  
  const columns = getColumns();
  
  // Image aspect ratio classes
  const imageRatioClasses = {
    default: 'aspect-[4/3]',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
  };
  
  // Get heading size class
  const getHeadingClass = (size: string) => {
    const sizes: { [key: string]: string } = {
      h1: 'text-4xl md:text-5xl font-bold',
      h2: 'text-3xl md:text-4xl font-bold',
      h3: 'text-2xl md:text-3xl font-semibold',
      h4: 'text-xl md:text-2xl font-semibold',
      h5: 'text-lg md:text-xl font-medium',
      h6: 'text-base md:text-lg font-medium',
      h7: 'text-sm md:text-base',
      h8: 'text-xs md:text-sm',
    };
    return sizes[size] || sizes.h3;
  };
  
  // Render stars component
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5" fill={config.starsColor || '#fbbf24'} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5" fill={config.starsColor || '#fbbf24'} viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor={config.starsColor || '#fbbf24'}/>
                <stop offset="50%" stopColor="#e5e7eb"/>
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5" fill="#e5e7eb" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };
  
  return (
    <section
      className="relative"
      style={{
        paddingTop: `${config.topSpacing || 40}px`,
        paddingBottom: `${config.bottomSpacing || 40}px`,
        backgroundColor: colorScheme.background?.default || '#FFFFFF',
        color: colorScheme.text?.default || '#000000',
      }}
    >
      <div className={`${widthClasses[config.width || 'page']} ${containerClass}`}>
        {/* Heading */}
        {config.heading && (
          <div className={`mb-8 ${config.headingAlignment === 'left' ? 'text-left' : 'text-center'}`}>
            <h2 className={getHeadingClass(config.headingSize || 'h2')}>
              {config.heading}
            </h2>
          </div>
        )}
        
        {/* Cards Grid */}
        <div 
          className={`
            grid 
            ${isMobile ? (
              config.mobileLayout === 'twoColumn' ? 'grid-cols-2' : 'grid-cols-1'
            ) : (
              columns === 1 ? 'grid-cols-1' :
              columns === 2 ? 'grid-cols-2' :
              columns === 3 ? 'grid-cols-3' :
              columns === 4 ? 'grid-cols-4' :
              columns === 5 ? 'grid-cols-5' :
              'grid-cols-3'
            )}
          `}
          style={{
            gap: isMobile ? `${config.mobileGap || 16}px` : `${config.desktopGap || 24}px`
          }}
        >
          {mockItems.slice(0, config.cardsToShow || 3).map((item) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden"
              style={{
                borderRadius: `${config.edgeRounding || 8}px`
              }}
            >
              {/* Card Background */}
              {config.colorCardBackground && (
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: colorScheme.background?.subtle || '#f9fafb' }}
                />
              )}
              
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <div 
                  className={`${imageRatioClasses[config.imageRatio || 'landscape']} bg-gray-200 relative overflow-hidden`}
                  style={{ borderRadius: `${config.edgeRounding || 8}px` }}
                >
                  {/* Placeholder image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                  
                  {/* Sale Badge */}
                  {config.showSaleBadge && item.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      {item.discount}% OFF
                    </div>
                  )}
                  
                  {/* Sold Out Badge */}
                  {config.showSoldOutBadge && !item.available && (
                    <div className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 text-xs font-semibold rounded">
                      Sold Out
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div 
                className={`py-5 px-4 ${config.contentAlignment === 'left' ? 'text-left' : 'text-center'}`}
              >
                {/* Title */}
                <h3 className="font-medium text-xl mb-3">
                  {item.title}
                </h3>
                
                {/* Rating */}
                {config.productRating && config.productRating !== 'none' && (
                  <div className={`flex items-center gap-2 mb-3 ${config.contentAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
                    {(config.productRating.includes('stars')) && renderStars(item.rating)}
                    {config.productRating === 'average-rating-and-stars' && (
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    )}
                    {config.productRating === 'review-count-and-stars' && (
                      <span className="text-sm text-gray-600">({item.reviewCount})</span>
                    )}
                  </div>
                )}
                
                {/* Price */}
                <div className={`flex items-center gap-3 mb-4 ${config.contentAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
                  <span className="text-2xl font-bold">
                    ${item.price.toFixed(2)} {config.showCurrencyCode && item.currency}
                  </span>
                  {item.comparePrice && (
                    <span className="text-base text-gray-500 line-through">
                      ${item.comparePrice.toFixed(2)} {config.showCurrencyCode && item.currency}
                    </span>
                  )}
                  {config.showSaleBadgeNextToPrice && item.discount && (
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded font-medium">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>
                
                {/* Button */}
                {(config.showBuyButton || config.showReserveButton || config.showAddToCart) && (
                  <button
                    className={`
                      w-full py-3 px-6 font-semibold rounded-md transition-all text-base
                      ${config.buttonStyle === 'outline' ? (
                        `border-2 hover:bg-gray-50`
                      ) : (
                        `text-white hover:opacity-90`
                      )}
                    `}
                    style={{
                      backgroundColor: config.buttonStyle === 'solid' ? (colorScheme.solidButton?.default || '#ff5722') : 'transparent',
                      borderColor: config.buttonStyle === 'outline' ? (colorScheme.outlineButton?.default || '#ff5722') : 'transparent',
                      color: config.buttonStyle === 'solid' ? 
                        (colorScheme.solidButtonText?.default || '#FFFFFF') : 
                        (colorScheme.outlineButtonText?.default || '#ff5722')
                    }}
                  >
                    {config.showReserveButton ? 'Reservar' : 
                     config.showBuyButton ? 'Comprar' : 
                     'Agregar al carrito'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
