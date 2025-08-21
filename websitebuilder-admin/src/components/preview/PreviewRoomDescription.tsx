'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface RoomDescriptionConfig {
  enabled: boolean;
  description: string;
  showMore: boolean;
  maxLines: number;
}

interface PreviewRoomDescriptionProps {
  config: RoomDescriptionConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomDescription({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomDescriptionProps) {
  
  const [isExpanded, setIsExpanded] = useState(false);
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

  const description = roomData?.description || config.description;

  if (!config.enabled || !description) {
    return null;
  }

  const shouldShowButton = config.showMore && description.length > 200;
  const displayText = !isExpanded && shouldShowButton 
    ? description.slice(0, 200) + '...'
    : description;

  return (
    <div className="container mx-auto px-6 py-6 border-t">
      <div className="max-w-3xl">
        <p className="text-base text-gray-700 whitespace-pre-wrap">
          {displayText}
        </p>
        
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 font-semibold underline hover:no-underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}