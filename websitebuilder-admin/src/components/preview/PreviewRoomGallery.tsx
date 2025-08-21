'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3x3, X } from 'lucide-react';

interface RoomGalleryConfig {
  enabled: boolean;
  roomId?: number;
  images: string[];
  layoutStyle: 'airbnb' | 'grid' | 'carousel';
  cornerRadius: 'none' | 'small' | 'medium' | 'large';
  showAllPhotosButton: boolean;
  autoFetch: boolean;
}

interface PreviewRoomGalleryProps {
  config: RoomGalleryConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomGallery({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomGalleryProps) {
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [images, setImages] = useState<string[]>(config.images || []);
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

  // Fetch room images if autoFetch is enabled
  useEffect(() => {
    const fetchRoomData = async () => {
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId') || '1';
      
      setLoading(true);
      try {
        let roomData;
        
        if (config.roomId) {
          // Fetch specific room if ID provided
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/${config.roomId}`
          );
          if (response.ok) {
            roomData = await response.json();
          }
        } else {
          // Fetch first active room
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/company/${companyId}/first-active`
          );
          if (response.ok) {
            roomData = await response.json();
          }
        }
        
        if (roomData && roomData.images && roomData.images.length > 0) {
          setImages(roomData.images.slice(0, 5)); // Use first 5 images from room
        } else {
          setImages(config.images); // Fallback to config images
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        setImages(config.images); // Fallback to config images
      } finally {
        setLoading(false);
      }
    };

    if (config.autoFetch) {
      fetchRoomData();
    } else {
      setImages(config.images);
    }
  }, [config.autoFetch, config.roomId, config.images]);

  if (!config.enabled) {
    return null;
  }

  if (loading && isEditor) {
    return (
      <div className="container mx-auto px-6 pt-6">
        <div className="h-[560px] bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading room images...</p>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const getCornerRadius = () => {
    switch (config.cornerRadius) {
      case 'none': return '';
      case 'small': return 'rounded';
      case 'medium': return 'rounded-xl';
      case 'large': return 'rounded-2xl';
      default: return 'rounded-xl';
    }
  };

  // Full screen photo modal
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
        <div className="container mx-auto py-4">
          <button
            onClick={() => setShowAllPhotos(false)}
            className="fixed top-4 left-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="space-y-4 pt-12">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Room photo ${index + 1}`}
                className="w-full h-auto mx-auto max-w-5xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile carousel view
  if (isMobile || config.layoutStyle === 'carousel') {
    return (
      <div className="relative h-[300px] bg-gray-100">
        <img
          src={images[currentImageIndex]}
          alt="Room"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {images.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop Airbnb layout (1 large + 4 small)
  if (config.layoutStyle === 'airbnb') {
    return (
      <div className={`container mx-auto px-6 pt-6`}>
        <div className={`grid grid-cols-4 grid-rows-2 gap-2 h-[560px] ${getCornerRadius()} overflow-hidden relative`}>
          {/* Main large image */}
          <div className="col-span-2 row-span-2">
            <img
              src={images[0]}
              alt="Room main"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>
          
          {/* 4 smaller images */}
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Room ${index + 2}`}
                className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          ))}
          
          {/* Show all photos button */}
          {config.showAllPhotosButton && images.length > 5 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg border border-gray-900 flex items-center gap-2 hover:bg-gray-50 transition text-sm font-medium"
            >
              <Grid3x3 className="w-4 h-4" />
              Show all photos
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid layout (all equal size)
  if (config.layoutStyle === 'grid') {
    const gridCols = isMobile ? 'grid-cols-2' : 'grid-cols-3';
    
    return (
      <div className={`container mx-auto px-6 pt-6`}>
        <div className={`grid ${gridCols} gap-2 ${getCornerRadius()} overflow-hidden`}>
          {images.map((image, index) => (
            <div key={index} className="aspect-square">
              <img
                src={image}
                alt={`Room ${index + 1}`}
                className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          ))}
        </div>
        
        {config.showAllPhotosButton && (
          <button
            onClick={() => setShowAllPhotos(true)}
            className="mt-4 px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            Show all {images.length} photos
          </button>
        )}
      </div>
    );
  }

  return null;
}