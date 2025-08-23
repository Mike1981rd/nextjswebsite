'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';
import IconRenderer from '@/components/ui/IconRenderer';
import { useConfigOptions } from '@/hooks/useConfigOptions';
import useThemeConfigStore from '@/stores/useThemeConfigStore';

interface Amenity {
  id: string;
  icon: string;
  name: string;
  available: boolean;
}

interface RoomAmenitiesConfig {
  enabled: boolean;
  colorScheme?: string;
  title: string;
  amenities?: Amenity[];
  columns: number;
  showUnavailable: boolean;
  iconSize?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
  titleSpacing?: number;
  headingSize?: number;
  headingWeight?: string;
  headingItalic?: boolean;
  headingUnderline?: boolean;
}

interface PreviewRoomAmenitiesProps {
  config: RoomAmenitiesConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomAmenities({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomAmenitiesProps) {
  
  const [showAll, setShowAll] = useState(false);
  
  // Get theme config from store if not passed as prop
  const { config: themeConfigFromStore } = useThemeConfigStore();
  const themeConfig = theme || themeConfigFromStore;
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  const [roomData, setRoomData] = useState<any>(null);
  
  // Get amenity options from ConfigOptions for icon mapping
  const { options: amenityOptions } = useConfigOptions('amenity');

  useEffect(() => {
    if (deviceView !== undefined) {
      setIsMobile(deviceView === 'mobile');
      return;
    }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceView]);

  // Auto-fetch room data for both editor and preview
  useEffect(() => {
    const fetchRoomData = async () => {
      const companyId = localStorage.getItem('companyId') || '1';
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/company/${companyId}/first-active`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('=== Room Data Debug ===');
          console.log('Full room data:', data);
          console.log('Amenities type:', typeof data.amenities);
          console.log('Amenities value:', data.amenities);
          console.log('First amenity:', data.amenities?.[0]);
          console.log('====================');
          setRoomData(data);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    // Fetch in both editor and preview modes
    if (config.enabled) {
      fetchRoomData();
    }
  }, [config.enabled]);

  if (!config.enabled) return null;

  // Map room amenities to display format
  const roomAmenities = roomData?.amenities ? 
    roomData.amenities.map((amenity: any, index: number) => {
      // Handle both string array and object array formats
      const amenityName = typeof amenity === 'string' ? amenity : amenity.name;

      // Find the matching amenity option from ConfigOptions to get its icon and iconType
      const matchingOption = amenityOptions?.find(opt => 
        opt.label?.toLowerCase() === amenityName.toLowerCase()
      );

      const amenityIcon = matchingOption?.icon;
      const amenityIconType = matchingOption?.iconType as 'heroicon' | 'emoji' | 'custom' | undefined;

      return {
        id: index.toString(),
        icon: amenityIcon,
        iconType: amenityIconType,
        name: amenityName,
        available: true
      };
    }) : null;

  const amenities = roomAmenities || config.amenities || [];
  
  // Get the selected color scheme
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) {
      // Fallback colors if no theme config
      return {
        text: '#000000',
        background: '#FFFFFF',
        solidButton: '#000000',
        solidButtonText: '#FFFFFF',
        outlineButton: '#000000',
        outlineButtonText: '#000000',
        link: '#0066CC',
        border: '#E5E5E5',
        foreground: '#F5F5F5'
      };
    }
    
    // config.colorScheme is "1", "2", etc. - convert to index
    const schemeIndex = parseInt(config.colorScheme || '1') - 1;
    const selectedScheme = themeConfig.colorSchemes.schemes[schemeIndex];
    
    return selectedScheme || themeConfig.colorSchemes.schemes[0];
  }, [themeConfig, config.colorScheme]);

  // Generate typography styles for headings
  const headingTypographyStyles = useMemo(() => {
    if (!themeConfig?.typography?.headings) return {};
    
    const heading = themeConfig.typography.headings;
    return {
      fontFamily: `'${heading.fontFamily}', sans-serif`,
      fontWeight: heading.fontWeight || '600',
      textTransform: heading.useUppercase ? 'uppercase' as const : 'none' as const,
      fontSize: heading.fontSize ? 
        (heading.fontSize <= 100 ? 
          `${heading.fontSize}%` : 
          `${heading.fontSize}px`) : '100%',
      letterSpacing: `${heading.letterSpacing || 0}px`
    };
  }, [themeConfig?.typography?.headings]);

  // Generate typography styles for body text
  const bodyTypographyStyles = useMemo(() => {
    if (!themeConfig?.typography?.body) return {};
    
    const body = themeConfig.typography.body;
    return {
      fontFamily: `'${body.fontFamily}', sans-serif`,
      fontWeight: body.fontWeight || '400',
      textTransform: body.useUppercase ? 'uppercase' as const : 'none' as const,
      fontSize: body.fontSize ? 
        (body.fontSize <= 100 ? 
          `${body.fontSize}%` : 
          `${body.fontSize}px`) : '100%',
      letterSpacing: `${body.letterSpacing || 0}px`
    };
  }, [themeConfig?.typography?.body]);

  // Generate typography styles for buttons
  const buttonTypographyStyles = useMemo(() => {
    if (!themeConfig?.typography?.buttons) return {};
    
    const buttons = themeConfig.typography.buttons;
    return {
      fontFamily: `'${buttons.fontFamily}', sans-serif`,
      fontWeight: buttons.fontWeight || '500',
      textTransform: buttons.useUppercase ? 'uppercase' as const : 'none' as const,
      fontSize: buttons.fontSize ? 
        (buttons.fontSize <= 100 ? 
          `${buttons.fontSize}%` : 
          `${buttons.fontSize}px`) : '100%',
      letterSpacing: `${buttons.letterSpacing || 0}px`
    };
  }, [themeConfig?.typography?.buttons]);

  const getIcon = (iconName?: string, iconType?: 'heroicon' | 'emoji' | 'custom') => {
    const size = config.iconSize || 24;
    const sizeInRem = size / 16; // Convert px to rem for better scaling
    
    if (!iconName) {
      return (
        <Check 
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`
          }} 
        />
      );
    }
    
    // For emojis, use fontSize
    if (iconType === 'emoji' || (!iconType && (iconName.length <= 3 || iconName.includes('️')))) {
      return (
        <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          {iconName}
        </span>
      );
    }
    
    // For other icons, pass size in className
    return (
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconRenderer 
          icon={iconName} 
          iconType={iconType} 
          className={`w-full h-full`}
        />
      </div>
    );
  };

  const displayAmenities = config.showUnavailable 
    ? amenities 
    : amenities.filter((a: Amenity) => a.available);

  const visibleAmenities = showAll ? displayAmenities : displayAmenities.slice(0, 10);
  const columns = isMobile ? 1 : config.columns || 2;

  return (
    <div 
      className="container mx-auto px-6 py-8"
      style={{
        borderTop: `1px solid ${colorScheme?.border || '#E5E5E5'}`,
        backgroundColor: colorScheme?.background || '#FFFFFF',
        color: colorScheme?.text || '#000000'
      }}
    >
      <h2 
        style={{ 
          ...headingTypographyStyles,
          color: colorScheme?.text || '#000000',
          marginBottom: `${config.titleSpacing || 24}px`,
          fontSize: config.headingSize ? `${config.headingSize}px` : (headingTypographyStyles.fontSize || '20px'),
          fontWeight: config.headingWeight || headingTypographyStyles.fontWeight || '600',
          fontStyle: config.headingItalic ? 'italic' : (headingTypographyStyles.fontStyle || 'normal'),
          textDecoration: config.headingUnderline ? 'underline' : 'none'
        }}
      >
        {config.title || 'What this place offers'}
      </h2>
      
      <div 
        className={`grid grid-cols-${columns} mb-6`}
        style={{
          gap: `${config.verticalSpacing || 16}px ${config.horizontalSpacing || 16}px`
        }}
      >
        {visibleAmenities.map((amenity) => (
          <div 
            key={amenity.id} 
            className={`flex items-center ${!amenity.available ? 'opacity-50 line-through' : ''}`}
            style={{ 
              color: !amenity.available ? colorScheme?.border : colorScheme?.text,
              gap: '12px' // Fixed gap between icon and text
            }}
          >
            {getIcon((amenity as any).icon, (amenity as any).iconType)}
            <span className="text-base" style={bodyTypographyStyles}>{amenity.name}</span>
          </div>
        ))}
      </div>

      {displayAmenities.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            color: colorScheme?.link || '#0066CC',
            borderColor: colorScheme?.border || '#E5E5E5',
            ...buttonTypographyStyles
          }}
          className="px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          {showAll ? `Show less` : `Show all ${displayAmenities.length} amenities`}
        </button>
      )}
    </div>
  );
}