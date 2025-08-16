/**
 * @file PreviewSlideshow.tsx
 * @description Preview component for Slideshow in the editor
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideshowConfig, SlideConfig } from '../editor/modules/Slideshow/types';

interface PreviewSlideshowProps {
  settings: SlideshowConfig;
  isEditor?: boolean;
  theme?: any;
  deviceView?: 'desktop' | 'mobile';
}

export default function PreviewSlideshow({ 
  settings, 
  isEditor = false,
  theme,
  deviceView 
}: PreviewSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const visibleSlides = settings.slides?.filter(s => s.visible) || [];
  
  // Auto-play functionality
  useEffect(() => {
    if (settings.autoplayMode === 'one-at-a-time' && visibleSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % visibleSlides.length);
      }, (settings.autoplaySpeed || 5) * 1000);
      
      return () => clearInterval(interval);
    }
  }, [settings.autoplayMode, settings.autoplaySpeed, visibleSlides.length]);

  // Get current slide or use defaults
  const slide = visibleSlides[currentSlide] || {};
  const isMobile = deviceView === 'mobile';
  
  // Determine width class based on settings
  const widthClass = settings.width === 'screen' ? 'w-full' : 
                     settings.width === 'page' ? 'max-w-7xl mx-auto' : 
                     'max-w-5xl mx-auto';

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + visibleSlides.length) % visibleSlides.length);
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % visibleSlides.length);
  };

  const showArrows = settings.showNavigationArrows === 'always' || 
                     (settings.showNavigationArrows === 'hover' && isEditor);

  // Pattern background SVG
  const patternSvg = `data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='0.5' opacity='0.08'%3E%3C!-- Camera --%3E%3Crect x='340' y='40' width='40' height='30' rx='4'/%3E%3Ccircle cx='360' cy='55' r='8'/%3E%3C!-- Watch --%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Crect x='45' y='30' width='10' height='40' rx='2'/%3E%3C!-- Bow tie --%3E%3Cpath d='M120 50 L140 40 L140 60 Z M160 50 L140 40 L140 60 Z'/%3E%3C!-- Diamond --%3E%3Cpath d='M250 30 L270 50 L250 70 L230 50 Z'/%3E%3C!-- Sunglasses --%3E%3Cellipse cx='50' cy='150' rx='20' ry='15'/%3E%3Cellipse cx='90' cy='150' rx='20' ry='15'/%3E%3Cpath d='M70 150 L70 150'/%3E%3C!-- Shopping bag --%3E%3Crect x='330' y='140' width='40' height='50' rx='2'/%3E%3Cpath d='M340 140 Q350 130 360 140'/%3E%3C!-- Perfume bottle --%3E%3Crect x='140' y='130' width='30' height='40' rx='4'/%3E%3Crect x='150' y='120' width='10' height='10'/%3E%3C!-- Shoe --%3E%3Cellipse cx='250' cy='160' rx='35' ry='12'/%3E%3Cpath d='M280 160 Q280 140 270 140'/%3E%3C!-- Handbag --%3E%3Cellipse cx='50' cy='250' rx='30' ry='20'/%3E%3Cpath d='M30 240 Q50 230 70 240'/%3E%3C!-- Necklace --%3E%3Ccircle cx='150' cy='250' r='25'/%3E%3Ccircle cx='150' cy='270' r='5'/%3E%3C!-- Ring --%3E%3Ccircle cx='250' cy='250' r='15'/%3E%3Ccircle cx='250' cy='250' r='8'/%3E%3C!-- Lipstick --%3E%3Crect x='340' y='240' width='10' height='30' rx='2'/%3E%3Crect x='338' y='235' width='14' height='8' rx='2'/%3E%3C!-- Earrings --%3E%3Ccircle cx='50' cy='350' r='8'/%3E%3Ccircle cx='50' cy='365' r='12'/%3E%3C!-- Wallet --%3E%3Crect x='130' y='340' width='50' height='35' rx='3'/%3E%3C!-- Belt --%3E%3Crect x='230' y='350' width='60' height='15' rx='2'/%3E%3Crect x='250' y='352' width='12' height='11' rx='1'/%3E%3C!-- Hat --%3E%3Cellipse cx='350' cy='360' rx='30' ry='10'/%3E%3Crect x='335' y='340' width='30' height='20' rx='10'/%3E%3C/g%3E%3C/svg%3E`;

  return (
    <div 
      className={`slideshow-container ${widthClass}`}
      style={{
        paddingTop: `${settings.topPadding || 0}px`,
        paddingBottom: `${settings.bottomPadding || 0}px`,
        paddingLeft: settings.addSidePaddings ? '20px' : '0',
        paddingRight: settings.addSidePaddings ? '20px' : '0',
      }}
    >
      <div 
        className="relative overflow-hidden"
        style={{ 
          aspectRatio: (isMobile ? settings.mobileRatio : settings.desktopRatio) || '16/9',
          minHeight: '400px',
          background: 'linear-gradient(135deg, #C4A962 0%, #B8995A 100%)',
          backgroundImage: `url("${patternSvg}")`,
          backgroundSize: '400px 400px',
          backgroundPosition: 'center'
        }}
      >
        {/* Check if slide has an actual image */}
        {(slide.mobileImage || slide.desktopImage) ? (
          <>
            {/* Actual image */}
            <img 
              src={isMobile ? slide.mobileImage : slide.desktopImage}
              alt={slide.heading || 'Slide image'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Content overlay on image */}
            <div className={`absolute inset-0 flex items-center ${
              slide.contentAlignment === 'center' ? 'justify-center' : 
              slide.contentAlignment === 'right' ? 'justify-end' : 
              'justify-start'
            }`}>
              <div className={`px-8 py-6 max-w-2xl ${
                slide.contentAlignment === 'center' ? 'text-center' : 
                slide.contentAlignment === 'right' ? 'text-right' : 
                'text-left'
              }`}>
                {slide.heading && (
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    {slide.heading}
                  </h2>
                )}
                {slide.subheading && (
                  <p className="text-lg md:text-xl mb-6 text-white drop-shadow-lg">
                    {slide.subheading}
                  </p>
                )}
                {(slide.buttonText || slide.secondButtonText) && (
                  <div className={`flex gap-4 ${
                    slide.contentAlignment === 'center' ? 'justify-center' : 
                    slide.contentAlignment === 'right' ? 'justify-end' : 
                    'justify-start'
                  }`}>
                    {slide.buttonText && (
                      <button className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors">
                        {slide.buttonText}
                      </button>
                    )}
                    {slide.secondButtonText && (
                      <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors">
                        {slide.secondButtonText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Default template structure when no image */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-2xl px-8">
              {/* IMAGE SLIDE Label */}
              <div className="text-xs font-medium tracking-[0.2em] uppercase text-black/60 mb-6">
                IMAGE SLIDE
              </div>
              
              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl font-serif text-black mb-4">
                {slide.heading || 'Image with text'}
              </h2>
              
              {/* Subheading */}
              <p className="text-base text-black/80 mb-8 max-w-xl mx-auto leading-relaxed">
                {slide.subheading || 'Fill in the text to tell customers by what your products are inspired.'}
              </p>
              
              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button 
                  className="px-8 py-3 bg-black/10 backdrop-blur-sm border border-black/20 text-black font-medium hover:bg-black/20 transition-colors"
                  style={{ minWidth: '150px' }}
                >
                  {slide.buttonText || 'Button label'}
                </button>
                
                <button 
                  className="px-8 py-3 bg-transparent border border-black/20 text-black font-medium hover:bg-black/10 transition-colors"
                  style={{ minWidth: '150px' }}
                >
                  {slide.secondButtonText || 'Button label'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {showArrows && visibleSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors ${
                settings.desktopArrowsPosition === 'corner' ? 'md:left-4 md:top-4 md:translate-y-0' : ''
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors ${
                settings.desktopArrowsPosition === 'corner' ? 'md:right-4 md:top-4 md:translate-y-0' : ''
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Navigation Dots */}
        {settings.showNavigationCircles && visibleSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {visibleSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Play/Pause Button */}
        {settings.showPlayPauseButton && settings.autoplayMode === 'one-at-a-time' && (
          <button className="absolute bottom-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}