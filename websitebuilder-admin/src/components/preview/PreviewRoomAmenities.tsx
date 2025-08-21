'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Tv, Car, Wind, Coffee, Utensils, Dumbbell, Trees, Bath, Flame } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Amenity {
  id: string;
  icon: string;
  name: string;
  available: boolean;
}

interface RoomAmenitiesConfig {
  enabled: boolean;
  title: string;
  amenities: Amenity[];
  columns: number;
  showUnavailable: boolean;
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
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  const [roomData, setRoomData] = useState<any>(null);

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
          console.log('Room amenities data:', data.amenities); // Debug log
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

  // Icon mapping for common amenities
  const amenityIconMap: { [key: string]: string } = {
    'wifi': 'Wifi',
    'wi-fi': 'Wifi',
    'internet': 'Wifi',
    'tv': 'Tv',
    'television': 'Tv',
    'parking': 'Car',
    'car': 'Car',
    'air conditioning': 'Wind',
    'ac': 'Wind',
    'coffee': 'Coffee',
    'kitchen': 'Utensils',
    'gym': 'Dumbbell',
    'garden': 'Trees',
    'pool': 'Waves',
    'bath': 'Bath',
    'bathtub': 'Bath',
    'heating': 'Flame',
    'washer': 'Shirt',
    'dryer': 'Wind',
    'workspace': 'Monitor',
    'desk': 'Monitor'
  };

  const getAmenityIcon = (amenityName: string): string => {
    const lowerName = amenityName.toLowerCase();
    for (const [key, icon] of Object.entries(amenityIconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return 'Check'; // Default icon
  };

  // Map room amenities to display format
  const roomAmenities = roomData?.amenities ? 
    roomData.amenities.map((amenity: any, index: number) => {
      // Handle both string array and object array formats
      const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
      const amenityIcon = typeof amenity === 'object' && amenity.icon ? 
        amenity.icon : getAmenityIcon(amenityName);
      
      return {
        id: index.toString(),
        icon: amenityIcon,
        name: amenityName,
        available: true
      };
    }) : null;

  const amenities = roomAmenities || config.amenities;

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Wifi className="w-6 h-6" />;
  };

  const displayAmenities = config.showUnavailable 
    ? amenities 
    : amenities.filter((a: Amenity) => a.available);

  const visibleAmenities = showAll ? displayAmenities : displayAmenities.slice(0, 10);
  const columns = isMobile ? 1 : config.columns || 2;

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      <h2 className="text-xl font-semibold mb-6">
        {config.title || 'What this place offers'}
      </h2>
      
      <div className={`grid grid-cols-${columns} gap-4 mb-6`}>
        {visibleAmenities.map((amenity) => (
          <div 
            key={amenity.id} 
            className={`flex items-center gap-3 py-2 ${!amenity.available ? 'opacity-50 line-through' : ''}`}
          >
            {getIcon(amenity.icon)}
            <span className="text-base">{amenity.name}</span>
          </div>
        ))}
      </div>

      {displayAmenities.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          {showAll ? `Show less` : `Show all ${displayAmenities.length} amenities`}
        </button>
      )}
    </div>
  );
}