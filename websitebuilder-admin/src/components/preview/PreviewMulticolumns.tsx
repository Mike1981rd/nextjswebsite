/**
 * @file PreviewMulticolumns.tsx
 * @max-lines 300
 * @module Multicolumns
 * @description Preview unificado para Multicolumns - sirve tanto para editor como para preview final
 * @template-section true
 * @unified-preview true
 */

'use client';

import React from 'react';
import { Star, Heart, Check, Zap, Award, Flag, ThumbsUp, ShoppingCart, Truck, Gift, Percent, Tag, Lock, CreditCard, Phone, Mail, HelpCircle, ScanLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { MulticolumnsConfig } from '@/components/editor/modules/Multicolumns/types';
import useThemeConfigStore from '@/stores/useThemeConfigStore';

interface PreviewMulticolumnsProps {
  config: MulticolumnsConfig;
  theme?: any;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  isEditor?: boolean;
}

// Map icon names to components
const iconMap: Record<string, any> = {
  'star': Star,
  'heart': Heart,
  'check': Check,
  'zap': Zap,
  'award': Award,
  'flag': Flag,
  'thumbs-up': ThumbsUp,
  'barcode': ScanLine,
  'shopping-cart': ShoppingCart,
  'truck': Truck,
  'gift': Gift,
  'percent': Percent,
  'tag': Tag,
  'lock': Lock,
  'credit-card': CreditCard,
  'phone': Phone,
  'mail': Mail,
  'help-circle': HelpCircle,
};

export default function PreviewMulticolumns({ 
  config, 
  theme, 
  deviceView, 
  isEditor = false 
}: PreviewMulticolumnsProps) {
  // Use theme from props or from store (unified architecture pattern)
  const storeThemeConfig = useThemeConfigStore(state => state.config);
  const themeConfig = theme || storeThemeConfig;
  
  if (!config.enabled && !isEditor) {
    return null;
  }

  // Get color scheme
  const colorScheme = themeConfig?.colorSchemes?.schemes?.[parseInt(config.colorScheme) - 1] || 
    themeConfig?.colorSchemes?.schemes?.[0];

  // Get typography with size overrides
  const headingStyle = {
    fontSize: `${(themeConfig?.typography?.headings?.base?.size || 32) * config.headingSize}px`,
    fontFamily: themeConfig?.typography?.headings?.base?.fontFamily,
    fontWeight: themeConfig?.typography?.headings?.base?.fontWeight,
    letterSpacing: themeConfig?.typography?.headings?.base?.letterSpacing,
    color: colorScheme?.text?.heading,
  };

  const bodyStyle = {
    fontSize: `${(themeConfig?.typography?.body?.base?.size || 16) * config.bodySize}px`,
    fontFamily: themeConfig?.typography?.body?.base?.fontFamily,
    fontWeight: themeConfig?.typography?.body?.base?.fontWeight,
    lineHeight: themeConfig?.typography?.body?.base?.lineHeight,
    color: colorScheme?.text?.body,
  };

  const columnsHeadingStyle = {
    fontSize: `${(themeConfig?.typography?.headings?.base?.size || 24) * config.columnsHeadingSize}px`,
    fontFamily: themeConfig?.typography?.headings?.base?.fontFamily,
    fontWeight: themeConfig?.typography?.headings?.base?.fontWeight,
    color: colorScheme?.text?.heading,
  };

  const columnsBodyStyle = {
    fontSize: `${(themeConfig?.typography?.body?.base?.size || 14) * config.columnsBodySize}px`,
    fontFamily: themeConfig?.typography?.body?.base?.fontFamily,
    fontWeight: themeConfig?.typography?.body?.base?.fontWeight,
    lineHeight: themeConfig?.typography?.body?.base?.lineHeight,
    color: colorScheme?.text?.body,
  };

  // Determine layout based on device
  const isMobile = deviceView === 'mobile';
  const layout = isMobile ? config.mobileLayout : config.desktopLayout;
  const cardsPerRow = isMobile ? 1 : config.desktopCardsPerRow;
  const spacing = isMobile ? config.mobileSpacing : config.desktopSpacing;
  const cardSpacing = isMobile ? config.mobileSpaceBetweenCards : config.desktopSpaceBetweenCards;

  // Width classes
  const widthClasses = {
    'screen': 'w-full',
    'page': 'max-w-7xl mx-auto',
    'large': 'max-w-6xl mx-auto',
    'medium': 'max-w-4xl mx-auto'
  };

  // Render icon
  const renderIcon = (item: any) => {
    if (item.icon === 'custom' && item.customIcon) {
      return <div dangerouslySetInnerHTML={{ __html: item.customIcon }} />;
    }
    const IconComponent = iconMap[item.icon] || Star;
    return <IconComponent style={{ width: item.iconSize, height: item.iconSize, color: colorScheme?.text?.body }} />;
  };

  // Render column
  const renderColumn = (item: any, index: number) => {
    if (!item.visible) return null;

    return (
      <div 
        key={item.id || index}
        className={`flex flex-col ${config.contentAlignment === 'center' ? 'items-center text-center' : config.contentAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
        style={{
          backgroundColor: config.colorColumns ? colorScheme?.background?.secondary : 'transparent',
          padding: config.colorColumns ? '24px' : '0',
          borderRadius: config.colorColumns ? '8px' : '0',
        }}
      >
        {/* Icon */}
        <div className="mb-4">
          {renderIcon(item)}
        </div>

        {/* Heading */}
        {item.heading && (
          <h3 style={columnsHeadingStyle} className="mb-2">
            {item.heading}
          </h3>
        )}

        {/* Body */}
        {item.body && (
          <p style={columnsBodyStyle} className="mb-4">
            {item.body}
          </p>
        )}

        {/* Link */}
        {item.linkLabel && item.link && (
          <a 
            href={item.link} 
            style={{ color: colorScheme?.text?.link }}
            className="underline hover:no-underline transition-all"
          >
            {item.linkLabel} →
          </a>
        )}
      </div>
    );
  };

  // Carousel/Slideshow controls
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const visibleItems = config.items.filter(item => item.visible);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleItems.length);
  };

  return (
    <section 
      style={{ 
        backgroundColor: colorScheme?.background?.primary,
        paddingTop: `${config.topPadding}px`,
        paddingBottom: `${config.bottomPadding}px`,
        paddingLeft: config.addSidePaddings ? '20px' : '0',
        paddingRight: config.addSidePaddings ? '20px' : '0',
      }}
      className={!config.enabled && isEditor ? 'opacity-50' : ''}
    >
      <div className={widthClasses[config.width]}>
        {/* Main heading and body */}
        {(config.heading || config.body) && (
          <div 
            className={`mb-8 ${config.contentAlignment === 'center' ? 'text-center' : config.contentAlignment === 'right' ? 'text-right' : 'text-left'}`}
          >
            {config.heading && (
              <h2 style={headingStyle} className="mb-4">
                {config.heading}
              </h2>
            )}
            {config.body && (
              <p style={bodyStyle}>
                {config.body}
              </p>
            )}
          </div>
        )}

        {/* Columns layout */}
        {layout === 'grid' && (
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
              gap: `${cardSpacing}px`,
              marginTop: `${spacing}px`
            }}
          >
            {visibleItems.map((item, index) => renderColumn(item, index))}
          </div>
        )}

        {/* Carousel layout */}
        {(layout === 'carousel' || layout === 'slideshow') && (
          <div className="relative">
            {config.showArrowsOnHover && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all"
                  style={{ zIndex: 10 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all"
                  style={{ zIndex: 10 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  gap: `${cardSpacing}px`
                }}
              >
                {visibleItems.map((item, index) => (
                  <div key={item.id || index} className="flex-none w-full">
                    {renderColumn(item, index)}
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            {layout === 'slideshow' && (
              <div className="flex justify-center gap-2 mt-4">
                {visibleItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-gray-800 w-6' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1 Column layout for mobile */}
        {layout === '1column' && (
          <div className="space-y-6" style={{ marginTop: `${spacing}px` }}>
            {visibleItems.map((item, index) => renderColumn(item, index))}
          </div>
        )}

        {/* Button */}
        {config.buttonLabel && config.buttonLink && (
          <div className={`mt-8 ${config.contentAlignment === 'center' ? 'text-center' : config.contentAlignment === 'right' ? 'text-right' : 'text-left'}`}>
            <a
              href={config.buttonLink}
              className={`inline-block px-6 py-3 rounded transition-all ${
                config.buttonStyle === 'solid' 
                  ? 'text-white' 
                  : 'border-2'
              }`}
              style={{
                backgroundColor: config.buttonStyle === 'solid' ? colorScheme?.buttons?.primary?.background : 'transparent',
                borderColor: colorScheme?.buttons?.primary?.background,
                color: config.buttonStyle === 'solid' ? colorScheme?.buttons?.primary?.text : colorScheme?.buttons?.primary?.background,
              }}
            >
              {config.buttonLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}