'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Share, Heart, Medal, Shield, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import useThemeConfigStore from '@/stores/useThemeConfigStore';

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface RoomTitleHostConfig {
  enabled: boolean;
  colorScheme?: 1 | 2 | 3 | 4 | 5;
  fontSize?: {
    title: number;
    subtitle: number;
    details: number;
  };
  alignment?: 'left' | 'center' | 'right';
  showRating?: boolean;
  showSuperhost?: boolean;
  showHostImage?: boolean;
  showHostVerification?: boolean;
  showReservationWidget?: boolean;
  reserveButtonText?: string; // Custom button text
  showHighlights?: boolean; // Show highlights section
  highlights?: Highlight[]; // Highlights configuration
  spacing?: 'compact' | 'comfortable' | 'spacious';
  hostImageSize?: number; // Size in pixels
  paddingTop?: number; // Internal top padding in pixels
  paddingBottom?: number; // Internal bottom padding in pixels
  containerPaddingTop?: number; // External container top margin
  containerPaddingBottom?: number; // External container bottom margin
}

interface PreviewRoomTitleHostProps {
  config: RoomTitleHostConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomTitleHost({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomTitleHostProps) {
  
  // Get theme config from store or prop
  const storeThemeConfig = useThemeConfigStore(state => state.config);
  const themeConfig = theme || storeThemeConfig;
  
  // Get the selected color scheme
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) return null;
    
    const schemeIndex = (config.colorScheme || 1) - 1;
    return themeConfig.colorSchemes.schemes[schemeIndex] || themeConfig.colorSchemes.schemes[0];
  }, [themeConfig, config.colorScheme]);
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guests, setGuests] = useState(1);

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
      
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/company/${companyId}/first-active`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Room data fetched:', data); // Debug log
          console.log('SleepingArrangements:', data.sleepingArrangements); // Debug log
          console.log('Host data:', data.host); // Debug log
          setRoomData(data);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch in both editor and preview modes when enabled
    if (config.enabled) {
      fetchRoomData();
    }
  }, [config.enabled]);

  if (!config.enabled) {
    return null;
  }

  // Parse SleepingArrangements if available
  let sleepingArrangements = null;
  if (roomData?.sleepingArrangements) {
    try {
      sleepingArrangements = typeof roomData.sleepingArrangements === 'string' 
        ? JSON.parse(roomData.sleepingArrangements) 
        : roomData.sleepingArrangements;
      console.log('Parsed sleepingArrangements:', sleepingArrangements); // Debug log
    } catch (e) {
      console.error('Error parsing sleepingArrangements:', e);
    }
  }

  // Use room data if available, with default fallbacks
  const displayData = roomData ? {
    title: roomData.name || 'Beautiful Room in City Center',
    location: roomData.city ? 
      `${roomData.neighborhood ? roomData.neighborhood + ', ' : ''}${roomData.city}${roomData.state ? ', ' + roomData.state : ''}`.trim() : 
      'San Francisco, California',
    guests: roomData.maxOccupancy || 4,
    bedrooms: sleepingArrangements?.totalRooms || sleepingArrangements?.totalBedrooms || 2,
    beds: sleepingArrangements?.totalBeds || 2,
    baths: sleepingArrangements?.totalBathrooms || 1,
    rating: roomData.averageRating || 4.92,
    reviewCount: roomData.totalReviews || 124,
    hostName: roomData.host?.fullName || roomData.host?.firstName || 'John',
    hostImage: roomData.host?.profilePicture || 'https://a0.muscache.com/defaults/user_pic-225x225.png?v=3',
    hostVerified: roomData.host?.isVerified !== undefined ? roomData.host.isVerified : true,
    hostSuperhost: roomData.host?.isSuperhost !== undefined ? roomData.host.isSuperhost : true,
    hostYears: roomData.host?.joinedDate ? 
      new Date().getFullYear() - new Date(roomData.host.joinedDate).getFullYear() : 
      5
  } : {
    title: 'Beautiful Room in City Center',
    location: 'San Francisco, California',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    rating: 4.92,
    reviewCount: 124,
    hostName: 'John',
    hostImage: 'https://a0.muscache.com/defaults/user_pic-225x225.png?v=3',
    hostVerified: true,
    hostSuperhost: true,
    hostYears: 5
  };
  
  // Get spacing classes
  const getSpacing = () => {
    switch(config.spacing) {
      case 'compact': return 'py-3 px-4';
      case 'spacious': return 'py-8 px-8';
      default: return 'py-6 px-6';
    }
  };
  
  // Get alignment styles
  const getAlignment = () => {
    switch(config.alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };
  
  // Get font sizes
  const getFontSizes = () => ({
    title: config.fontSize?.title ? `${config.fontSize.title}%` : '100%',
    subtitle: config.fontSize?.subtitle ? `${config.fontSize.subtitle}%` : '90%',
    details: config.fontSize?.details ? `${config.fontSize.details}%` : '85%'
  });

  const fontSizes = getFontSizes();
  
  // Get host image size - default to 48px if not specified
  const hostImageSize = config.hostImageSize || 48;
  
  // Get container spacing - asegurarse de que 0 se respete
  const containerTopPadding = config.containerPaddingTop !== undefined ? config.containerPaddingTop : 0;
  const containerBottomPadding = config.containerPaddingBottom !== undefined ? config.containerPaddingBottom : 0;
  
  // Calculate price per night (sample data)
  const pricePerNight = roomData?.pricePerNight || 43;
  const totalNights = 2;
  const cleaningFee = 15;
  const serviceFee = 8;
  const totalBeforeTaxes = (pricePerNight * totalNights) + cleaningFee + serviceFee;
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  return (
    <div style={{ 
      marginTop: `${containerTopPadding}px`,
      marginBottom: `${containerBottomPadding}px`
    }}>
      <div 
        style={{ 
          backgroundColor: colorScheme?.background || '#ffffff',
          color: colorScheme?.text || '#000000',
          paddingTop: `${config.paddingTop || 24}px`,
          paddingBottom: `${config.paddingBottom || 24}px`
        }}
      >
        <div className={`container mx-auto ${getSpacing()}`}>
          {/* Debug indicator for editor mode */}
          {isEditor && (
            <div className="mb-2 text-xs" style={{ color: colorScheme?.text || '#6b7280', opacity: 0.6 }}>
              {loading ? '⏳ Loading room data...' : roomData ? '✅ Using real room data' : '📝 Using config data'}
            </div>
          )}
          
          {/* Two column layout for desktop with reservation widget */}
          <div className={`${config.showReservationWidget !== false && !isMobile ? 'flex gap-8 items-start' : ''}`}>
            {/* Left column - Main content */}
            <div className={`${config.showReservationWidget !== false && !isMobile ? 'flex-1' : 'w-full'}`}>
              {/* Title and actions row */}
              <div className={`flex ${config.alignment === 'center' ? 'flex-col items-center' : config.alignment === 'right' ? 'flex-row-reverse' : ''} justify-between items-start mb-4`}>
                <div className={getAlignment()}>
                  <h1 
                    className="text-2xl md:text-3xl font-semibold mb-2"
                    style={{ 
                      fontSize: fontSizes.title,
                      color: colorScheme?.text || '#000000'
                    }}
                  >
                    {displayData.title}
                  </h1>
                  
                  <div 
                    className={`flex ${config.alignment === 'center' ? 'justify-center' : ''} items-center gap-2 text-sm`}
                    style={{ fontSize: fontSizes.subtitle }}
                  >
                    {config.showRating !== false && displayData.rating > 0 && (
                      <>
                        <Star className="w-4 h-4 fill-current" style={{ color: colorScheme?.text || '#000000' }} />
                        <span className="font-semibold" style={{ color: colorScheme?.text || '#000000' }}>{displayData.rating}</span>
                        <span style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>
                          ({displayData.reviewCount} reviews)
                        </span>
                        <span style={{ color: colorScheme?.text || '#000000', opacity: 0.4 }}>·</span>
                      </>
                    )}
                    {config.showSuperhost !== false && displayData.hostSuperhost && (
                      <>
                        <Medal className="w-4 h-4" style={{ color: colorScheme?.text || '#000000' }} />
                        <span style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>Superhost</span>
                        <span style={{ color: colorScheme?.text || '#000000', opacity: 0.4 }}>·</span>
                      </>
                    )}
                    <span style={{ color: colorScheme?.link || colorScheme?.text || '#000000', textDecoration: 'underline' }}>
                      {displayData.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property info */}
              <div 
                className={`flex ${config.alignment === 'center' ? 'justify-center' : ''} items-center gap-2 text-base mb-6`}
                style={{ fontSize: fontSizes.details }}
              >
                <span style={{ color: colorScheme?.text || '#000000' }}>{displayData.guests} guests</span>
                <span style={{ color: colorScheme?.text || '#000000', opacity: 0.4 }}>·</span>
                <span style={{ color: colorScheme?.text || '#000000' }}>{displayData.bedrooms} bedrooms</span>
                <span style={{ color: colorScheme?.text || '#000000', opacity: 0.4 }}>·</span>
                <span style={{ color: colorScheme?.text || '#000000' }}>{displayData.beds} beds</span>
                <span style={{ color: colorScheme?.text || '#000000', opacity: 0.4 }}>·</span>
                <span style={{ color: colorScheme?.text || '#000000' }}>{displayData.baths} bath{displayData.baths > 1 ? 's' : ''}</span>
              </div>

              {/* Host info */}
              <div 
                className={`flex ${config.alignment === 'center' ? 'justify-center' : ''} items-center gap-4 py-6 border-t border-b`}
                style={{ borderColor: colorScheme?.border || '#e5e7eb' }}
              >
                {config.showHostImage !== false && (
                  <div className="relative">
                    <img
                      src={displayData.hostImage}
                      alt={displayData.hostName}
                      className="rounded-full object-cover"
                      style={{
                        width: `${hostImageSize}px`,
                        height: `${hostImageSize}px`,
                        imageRendering: '-webkit-optimize-contrast',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        filter: 'none'
                      }}
                      loading="eager"
                      decoding="sync"
                    />
                    {config.showHostVerification !== false && displayData.hostVerified && (
                      <div 
                        className="absolute bg-white rounded-full p-0.5"
                        style={{
                          bottom: '-4px',
                          right: '-4px'
                        }}
                      >
                        <Shield className="w-4 h-4 text-blue-500 fill-current" />
                      </div>
                    )}
                  </div>
                )}
                <div className={getAlignment()}>
                  <div className="font-semibold text-base" style={{ color: colorScheme?.text || '#000000' }}>
                    Hosted by {displayData.hostName}
                  </div>
                  <div className="text-sm" style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>
                    {displayData.hostYears} years hosting
                  </div>
                </div>
              </div>

              {/* Room Highlights - Below host info */}
              {config.showHighlights !== false && (
                <div className="py-6 border-b" style={{ borderColor: colorScheme?.border || '#e5e7eb' }}>
                  {(() => {
                    const getIcon = (iconName: string) => {
                      const IconComponent = Icons[iconName as keyof typeof Icons];
                      return IconComponent ? <IconComponent className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />;
                    };

                    // Default highlights if none provided
                    const defaultHighlights = [
                      {
                        id: 'great-location',
                        icon: 'MapPin',
                        title: 'Great location',
                        description: '90% of recent guests gave the location a 5-star rating.'
                      },
                      {
                        id: 'self-checkin',
                        icon: 'DoorOpen',
                        title: 'Self check-in',
                        description: 'Check yourself in with the keypad.'
                      },
                      {
                        id: 'superhost',
                        icon: 'Award',
                        title: `${displayData.hostName} is a Superhost`,
                        description: 'Superhosts are experienced, highly rated hosts.'
                      }
                    ];

                    const displayHighlights = config.highlights && config.highlights.length > 0 
                      ? config.highlights 
                      : defaultHighlights;

                    return (
                      <div className="space-y-4">
                        {displayHighlights.slice(0, 3).map((highlight) => (
                          <div key={highlight.id} className="flex gap-4">
                            <div className="flex-shrink-0" style={{ color: colorScheme?.text || '#000000' }}>
                              {getIcon(highlight.icon)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-base mb-1" style={{ color: colorScheme?.text || '#000000' }}>
                                {highlight.title}
                              </h3>
                              <p className="text-sm" style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>
                                {highlight.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right column - Reservation Widget */}
            {config.showReservationWidget !== false && !isMobile && (
              <div className="w-[370px] flex-shrink-0 h-fit">
                <div 
                  className="sticky top-20 rounded-xl shadow-xl p-6"
                  style={{
                    backgroundColor: colorScheme?.cardBackground || '#ffffff',
                    border: `1px solid ${colorScheme?.border || '#e5e7eb'}`,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold" style={{ color: colorScheme?.text || '#000000' }}>
                        ${totalBeforeTaxes} USD
                      </span>
                      <span className="text-sm" style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>
                        for {totalNights} nights
                      </span>
                    </div>
                  </div>

                  {/* Date inputs */}
                  <div className="grid grid-cols-2 gap-0">
                    <div 
                      className="p-3 border rounded-tl-lg"
                      style={{ borderColor: colorScheme?.border || '#b0b0b0' }}
                    >
                      <label className="text-[10px] font-semibold uppercase block" style={{ color: colorScheme?.text || '#000000' }}>
                        CHECK-IN
                      </label>
                      <input 
                        type="text"
                        value="9/26/2025"
                        readOnly
                        className="w-full text-sm bg-transparent outline-none mt-1"
                        style={{ color: colorScheme?.text || '#000000' }}
                      />
                    </div>
                    <div 
                      className="p-3 border border-l-0 rounded-tr-lg"
                      style={{ borderColor: colorScheme?.border || '#b0b0b0' }}
                    >
                      <label className="text-[10px] font-semibold uppercase block" style={{ color: colorScheme?.text || '#000000' }}>
                        CHECKOUT
                      </label>
                      <input 
                        type="text"
                        value="9/28/2025"
                        readOnly
                        className="w-full text-sm bg-transparent outline-none mt-1"
                        style={{ color: colorScheme?.text || '#000000' }}
                      />
                    </div>
                  </div>

                  {/* Guests selector */}
                  <div 
                    className="p-3 border border-t-0 rounded-b-lg mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                    style={{ borderColor: colorScheme?.border || '#b0b0b0' }}
                  >
                    <div>
                      <label className="text-[10px] font-semibold uppercase block" style={{ color: colorScheme?.text || '#000000' }}>
                        GUESTS
                      </label>
                      <span className="text-sm mt-1 block" style={{ color: colorScheme?.text || '#000000' }}>
                        {guests} guest{guests > 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5" style={{ color: colorScheme?.text || '#000000' }} />
                  </div>

                  {/* Reserve button */}
                  <button 
                    className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colorScheme?.solidButton || '#FF385C',
                      color: colorScheme?.solidButtonText || '#ffffff',
                      fontSize: '16px'
                    }}
                  >
                    {config.reserveButtonText || 'Reserve'}
                  </button>

                  {/* Won't be charged message */}
                  <p className="text-center text-sm mt-2 mb-4" style={{ color: colorScheme?.text || '#000000', opacity: 0.7 }}>
                    You won't be charged yet
                  </p>

                  {/* Price breakdown */}
                  <div className="space-y-3 pt-4 border-t" style={{ borderColor: colorScheme?.border || '#e5e7eb' }}>
                    <button 
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                      className="w-full flex items-center justify-between text-sm hover:underline"
                      style={{ color: colorScheme?.text || '#000000' }}
                    >
                      <span>${pricePerNight} x {totalNights} nights</span>
                      <span>${pricePerNight * totalNights}</span>
                    </button>
                    
                    {showPriceDetails && (
                      <>
                        <div className="flex items-center justify-between text-sm" style={{ color: colorScheme?.text || '#000000' }}>
                          <span className="underline cursor-pointer">Cleaning fee</span>
                          <span>${cleaningFee}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm" style={{ color: colorScheme?.text || '#000000' }}>
                          <span className="underline cursor-pointer">Service fee</span>
                          <span>${serviceFee}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-3 border-t flex items-center justify-between font-semibold" style={{ borderColor: colorScheme?.border || '#e5e7eb' }}>
                      <span style={{ color: colorScheme?.text || '#000000' }}>Total before taxes</span>
                      <span style={{ color: colorScheme?.text || '#000000' }}>${totalBeforeTaxes}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}