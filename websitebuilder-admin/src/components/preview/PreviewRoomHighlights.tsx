'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, DoorOpen, Wifi, Car, Wind, Tv } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface RoomHighlightsConfig {
  enabled: boolean;
  highlights: Highlight[];
}

interface PreviewRoomHighlightsProps {
  config: RoomHighlightsConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomHighlights({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomHighlightsProps) {
  
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
          console.log('Room data for highlights:', data); // Debug log
          setRoomData(data);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch in both editor and preview modes
    if (config.enabled) {
      fetchRoomData();
    }
  }, [config.enabled]);

  if (!config.enabled) {
    return null;
  }

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />;
  };

  // Parse room details and common spaces to create highlights
  const roomDetails = roomData?.roomDetails ? 
    (typeof roomData.roomDetails === 'string' ? 
      JSON.parse(roomData.roomDetails) : 
      roomData.roomDetails) : null;
      
  const commonSpaces = roomData?.commonSpaces ? 
    (typeof roomData.commonSpaces === 'string' ? 
      JSON.parse(roomData.commonSpaces) : 
      roomData.commonSpaces) : null;

  // Create highlights from room data
  let displayHighlights = config.highlights;
  
  if (roomData) {
    const highlights: Highlight[] = [];
    
    // Add room details as highlights
    if (roomDetails) {
      // Add a highlight for room features
      const roomFeatures = [];
      if (roomDetails.workspace) roomFeatures.push('Dedicated workspace');
      if (roomDetails.airConditioning) roomFeatures.push('Air conditioning');
      if (roomDetails.heating) roomFeatures.push('Heating');
      if (roomDetails.tv) roomFeatures.push('TV');
      
      if (roomFeatures.length > 0) {
        highlights.push({
          id: 'room-features',
          icon: 'Home',
          title: 'Room amenities',
          description: roomFeatures.join(' • ')
        });
      }
    }
    
    // Add common spaces as highlights
    if (commonSpaces) {
      const spaces = [];
      if (commonSpaces.kitchen) spaces.push('Kitchen');
      if (commonSpaces.pool) spaces.push('Pool');
      if (commonSpaces.gym) spaces.push('Gym');
      if (commonSpaces.garden) spaces.push('Garden');
      if (commonSpaces.parking) spaces.push('Free parking');
      
      if (spaces.length > 0) {
        highlights.push({
          id: 'common-spaces',
          icon: 'Users',
          title: 'Shared spaces',
          description: spaces.join(' • ')
        });
      }
    }
    
    // Add location if available
    if (roomData.neighborhood || roomData.city) {
      highlights.push({
        id: 'location',
        icon: 'MapPin',
        title: 'Great location',
        description: `Located in ${roomData.neighborhood || roomData.city}`
      });
    }
    
    displayHighlights = highlights.length > 0 ? highlights : config.highlights;
  }

  if (displayHighlights.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayHighlights.slice(0, 3).map((highlight: Highlight) => (
          <div key={highlight.id} className="flex gap-4">
            <div className="flex-shrink-0">
              {getIcon(highlight.icon)}
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1">
                {highlight.title}
              </h3>
              <p className="text-sm text-gray-600">
                {highlight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}