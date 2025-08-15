/**
 * @file PreviewImageBanner.tsx
 * @max-lines 300
 * @current-lines 295
 * @architecture modular
 * @validates-rules ✅
 */

'use client';

import React, { useMemo } from 'react';
import { ImageBannerConfig } from './types';
import useThemeConfigStore from '@/stores/useThemeConfigStore';

interface PreviewImageBannerProps {
  config: ImageBannerConfig;
  isEditor?: boolean;
}

export function PreviewImageBanner({ config, isEditor = false }: PreviewImageBannerProps) {
  // Get color schemes from global theme config
  const { config: themeConfig } = useThemeConfigStore();
  
  // Get the selected color scheme
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) {
      // Fallback to default if no theme config
      return {
        text: '#000000',
        background: '#FFFFFF',
        solidButton: '#000000',
        solidButtonText: '#FFFFFF',
        outlineButton: '#000000',
        outlineButtonText: '#000000'
      };
    }
    
    // Find the scheme by ID (config.colorScheme is "1", "2", etc.)
    const schemeIndex = parseInt(config.colorScheme) - 1;
    const selectedScheme = themeConfig.colorSchemes.schemes[schemeIndex];
    
    if (!selectedScheme) {
      // If scheme not found, use the first one
      return themeConfig.colorSchemes.schemes[0];
    }
    
    return selectedScheme;
  }, [themeConfig, config.colorScheme]);

  // Width classes
  const widthClasses = {
    small: 'max-w-4xl mx-auto',
    medium: 'max-w-6xl mx-auto',
    large: 'max-w-7xl mx-auto',
    page: 'w-full',
    screen: 'w-screen relative left-1/2 right-1/2 -mx-[50vw]'
  };

  // Position classes for desktop
  const desktopPositionClasses = {
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',
    'center-left': 'items-center justify-start',
    'center': 'items-center justify-center',
    'center-right': 'items-center justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end'
  };

  // Mobile position classes
  const mobilePositionClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end'
  };

  // Text alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center'
  };

  // Heading size classes
  const headingSizeClasses = {
    1: 'text-3xl md:text-4xl lg:text-5xl',
    2: 'text-2xl md:text-3xl lg:text-4xl',
    3: 'text-xl md:text-2xl lg:text-3xl'
  };

  // Body size classes
  const bodySizeClasses = {
    1: 'text-sm md:text-base',
    2: 'text-base md:text-lg',
    3: 'text-lg md:text-xl'
  };

  // Background styles for content - using real color values
  const backgroundStyles = {
    solid: `bg-opacity-95`,
    outline: `border-2`,
    blurred: 'backdrop-blur-md bg-white/70 dark:bg-gray-900/70',
    shadow: 'shadow-2xl',
    transparent: 'bg-transparent',
    none: ''
  };

  // Button styles using actual scheme colors
  const getButtonClasses = (style: string) => {
    switch (style) {
      case 'solid':
        return 'transition-colors';
      case 'outline':
        return 'border-2 transition-colors';
      case 'text':
        return 'underline hover:no-underline';
      default:
        return 'transition-colors';
    }
  };

  // Style object for inline styles (since we're using hex colors)
  const getButtonStyles = (style: string) => {
    switch (style) {
      case 'solid':
        return {
          backgroundColor: colorScheme.solidButton,
          color: colorScheme.solidButtonText,
        };
      case 'outline':
        return {
          borderColor: colorScheme.outlineButton,
          color: colorScheme.outlineButtonText,
          backgroundColor: 'transparent'
        };
      case 'text':
        return {
          color: colorScheme.link,
          backgroundColor: 'transparent'
        };
      default:
        return {
          backgroundColor: colorScheme.solidButton,
          color: colorScheme.solidButtonText,
        };
    }
  };

  const getContentBackgroundStyle = (style: string) => {
    if (style === 'solid') {
      return { backgroundColor: colorScheme.background };
    } else if (style === 'outline') {
      return { borderColor: colorScheme.border };
    }
    return {};
  };

  // Check if media is video
  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <section 
      className={`relative overflow-hidden`}
      style={{
        paddingTop: `${config.topPadding}px`,
        paddingBottom: `${config.bottomPadding}px`,
        ...(config.colorBackground ? { backgroundColor: colorScheme.background } : {})
      }}
    >
      {/* Desktop View */}
      <div className="hidden md:block">
        <div 
          className={`relative ${widthClasses[config.width]} ${config.addSidePaddings ? 'px-4 lg:px-8' : ''}`}
          style={{ aspectRatio: config.desktopRatio }}
        >
          {/* Background Media */}
          {config.desktopImage && (
            <>
              {isVideo(config.desktopImage) ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={config.desktopImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={config.desktopImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: config.desktopOverlayOpacity / 100 }}
              />
            </>
          )}

          {/* Content Container */}
          <div className={`relative h-full flex ${desktopPositionClasses[config.desktopPosition]} p-8`}>
            <div 
              className={`${backgroundStyles[config.desktopBackground]} ${config.desktopBackground !== 'none' ? 'p-8 rounded-lg' : ''}`}
              style={{ 
                width: `${config.desktopWidth}%`,
                maxWidth: '800px',
                ...getContentBackgroundStyle(config.desktopBackground)
              }}
            >
              <div className={`${alignmentClasses[config.desktopAlignment]} space-y-${Math.ceil(config.desktopSpacing / 20) || 4}`}>
                {/* Subheading */}
                {config.subheading && (
                  <p 
                    className={`uppercase tracking-wider text-sm font-medium opacity-80`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.subheading}
                  </p>
                )}

                {/* Heading */}
                {config.heading && (
                  <h2 
                    className={`font-bold ${headingSizeClasses[config.headingSize]}`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.heading}
                  </h2>
                )}

                {/* Body */}
                {config.body && (
                  <p 
                    className={`${bodySizeClasses[config.bodySize]} opacity-90`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.body}
                  </p>
                )}

                {/* Buttons */}
                {(config.firstButtonLabel || config.secondButtonLabel) && (
                  <div className={`flex gap-4 mt-6 ${config.desktopAlignment === 'center' ? 'justify-center' : ''}`}>
                    {config.firstButtonLabel && (
                      <a
                        href={config.firstButtonLink || '#'}
                        className={`px-6 py-3 rounded-md font-medium ${getButtonClasses(config.firstButtonStyle)}`}
                        style={getButtonStyles(config.firstButtonStyle)}
                      >
                        {config.firstButtonLabel}
                      </a>
                    )}
                    {config.secondButtonLabel && (
                      <a
                        href={config.secondButtonLink || '#'}
                        className={`px-6 py-3 rounded-md font-medium ${getButtonClasses(config.secondButtonStyle)}`}
                        style={getButtonStyles(config.secondButtonStyle)}
                      >
                        {config.secondButtonLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div 
          className={`relative ${config.addSidePaddings ? 'mx-4' : ''}`}
          style={{ aspectRatio: config.mobileRatio }}
        >
          {/* Background Media */}
          {(config.mobileImage || config.desktopImage) && (
            <>
              {isVideo(config.mobileImage || config.desktopImage) ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={config.mobileImage || config.desktopImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={config.mobileImage || config.desktopImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: config.mobileOverlayOpacity / 100 }}
              />
            </>
          )}

          {/* Content Container */}
          <div className={`relative h-full flex ${mobilePositionClasses[config.mobilePosition]} justify-center p-6`}>
            <div 
              className={`${backgroundStyles[config.mobileBackground]} ${config.mobileBackground !== 'none' ? 'p-6 rounded-lg' : ''} w-full max-w-md`}
              style={getContentBackgroundStyle(config.mobileBackground)}
            >
              <div className={`${alignmentClasses[config.mobileAlignment]} space-y-3`}>
                {/* Subheading */}
                {config.subheading && (
                  <p 
                    className={`uppercase tracking-wider text-xs font-medium opacity-80`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.subheading}
                  </p>
                )}

                {/* Heading */}
                {config.heading && (
                  <h2 
                    className={`font-bold text-2xl`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.heading}
                  </h2>
                )}

                {/* Body */}
                {config.body && (
                  <p 
                    className={`text-base opacity-90`}
                    style={{ color: colorScheme.text }}
                  >
                    {config.body}
                  </p>
                )}

                {/* Buttons */}
                {(config.firstButtonLabel || config.secondButtonLabel) && (
                  <div className={`flex flex-col sm:flex-row gap-3 mt-4 ${config.mobileAlignment === 'center' ? 'items-center' : ''}`}>
                    {config.firstButtonLabel && (
                      <a
                        href={config.firstButtonLink || '#'}
                        className={`px-5 py-2.5 rounded-md font-medium text-sm ${getButtonClasses(config.firstButtonStyle)}`}
                        style={getButtonStyles(config.firstButtonStyle)}
                      >
                        {config.firstButtonLabel}
                      </a>
                    )}
                    {config.secondButtonLabel && (
                      <a
                        href={config.secondButtonLink || '#'}
                        className={`px-5 py-2.5 rounded-md font-medium text-sm ${getButtonClasses(config.secondButtonStyle)}`}
                        style={getButtonStyles(config.secondButtonStyle)}
                      >
                        {config.secondButtonLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Overlay */}
      {isEditor && (
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Image Banner
          </div>
        </div>
      )}
    </section>
  );
}