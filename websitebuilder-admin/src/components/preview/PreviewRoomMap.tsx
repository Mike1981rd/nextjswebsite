'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface RoomMapConfig {
  enabled: boolean;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  mapImage: string;
  showExactLocation: boolean;
}

interface PreviewRoomMapProps {
  config: RoomMapConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomMap({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomMapProps) {
  
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

  // Auto-fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      const companyId = localStorage.getItem('companyId') || '1';
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/company/${companyId}/first-active`
        );
        if (response.ok) {
          const data = await response.json();
          setRoomData(data);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    if (isEditor && config.enabled) {
      fetchRoomData();
    }
  }, [isEditor, config.enabled]);

  if (!config.enabled) {
    return null;
  }

  // Use room data if available, fallback to config
  const displayData = roomData ? {
    address: roomData.streetAddress || config.address,
    neighborhood: roomData.neighborhood || config.neighborhood,
    city: `${roomData.city || config.city}${roomData.state ? `, ${roomData.state}` : ''}`,
    description: config.description, // Use config as room doesn't have location description
    mapImage: config.mapImage,
    showExactLocation: config.showExactLocation
  } : config;

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      <h2 className="text-xl font-semibold mb-6">
        {config.title || 'Where you\'ll be'}
      </h2>

      {/* Map placeholder */}
      <div className="relative h-[400px] bg-gray-100 rounded-xl overflow-hidden mb-6">
        {displayData.mapImage ? (
          <img
            src={displayData.mapImage}
            alt="Location map"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Map preview</p>
            </div>
          </div>
        )}
        
        {!displayData.showExactLocation && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 text-center max-w-xs">
              <Navigation className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Exact location provided after booking</p>
            </div>
          </div>
        )}
      </div>

      {/* Location details */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-2">
            {displayData.neighborhood || 'Downtown'}, {displayData.city || 'San Francisco'}
          </h3>
          <p className="text-sm text-gray-600">
            {displayData.description || 'Great location with easy access to public transportation and local attractions.'}
          </p>
        </div>

        {displayData.showExactLocation && displayData.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600">{displayData.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}