'use client';

import React, { useState, useEffect } from 'react';
import { Star, Share, Heart, Medal, Shield, Calendar } from 'lucide-react';

interface RoomTitleHostConfig {
  enabled: boolean;
  title: string;
  location: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  reviewCount: number;
  hostName: string;
  hostImage: string;
  hostVerified: boolean;
  hostSuperhost: boolean;
  hostYears: number;
  showShareSave: boolean;
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
  
  // Mobile detection
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

  // Use room data if available, fallback to config
  const displayData = roomData ? {
    title: roomData.name || config.title,
    location: roomData.city ? 
      `${roomData.neighborhood ? roomData.neighborhood + ', ' : ''}${roomData.city}${roomData.state ? ', ' + roomData.state : ''}`.trim() : 
      config.location,
    guests: roomData.maxOccupancy || config.guests,
    bedrooms: sleepingArrangements?.totalRooms || sleepingArrangements?.totalBedrooms || config.bedrooms,
    beds: sleepingArrangements?.totalBeds || config.beds,
    baths: sleepingArrangements?.totalBathrooms || config.baths,
    rating: roomData.averageRating || config.rating,
    reviewCount: roomData.totalReviews || config.reviewCount,
    hostName: roomData.host?.fullName || roomData.host?.firstName || config.hostName,
    hostImage: roomData.host?.profilePicture || config.hostImage,
    hostVerified: roomData.host?.isVerified || config.hostVerified,
    hostSuperhost: roomData.host?.isSuperhost || config.hostSuperhost,
    hostYears: roomData.host?.joinedDate ? 
      new Date().getFullYear() - new Date(roomData.host.joinedDate).getFullYear() : 
      config.hostYears,
    showShareSave: config.showShareSave
  } : config;

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Debug indicator for editor mode */}
      {isEditor && (
        <div className="mb-2 text-xs text-gray-500">
          {loading ? '⏳ Loading room data...' : roomData ? '✅ Using real room data' : '📝 Using config data'}
        </div>
      )}
      
      {/* Title and actions row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            {displayData.title || 'Beautiful Room in City Center'}
          </h1>
          
          <div className="flex items-center gap-2 text-sm">
            {displayData.rating > 0 && (
              <>
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{displayData.rating}</span>
                <span className="text-gray-600">
                  ({displayData.reviewCount} reviews)
                </span>
                <span className="text-gray-400">·</span>
              </>
            )}
            {displayData.hostSuperhost && (
              <>
                <Medal className="w-4 h-4" />
                <span className="text-gray-600">Superhost</span>
                <span className="text-gray-400">·</span>
              </>
            )}
            <span className="text-gray-600 underline">
              {displayData.location || 'San Francisco, California'}
            </span>
          </div>
        </div>

        {displayData.showShareSave && !isMobile && (
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition">
              <Share className="w-4 h-4" />
              <span className="text-sm font-medium underline">Share</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium underline">Save</span>
            </button>
          </div>
        )}
      </div>

      {/* Property info */}
      <div className="flex items-center gap-2 text-base mb-6">
        <span>{displayData.guests || 4} guests</span>
        <span className="text-gray-400">·</span>
        <span>{displayData.bedrooms || 2} bedrooms</span>
        <span className="text-gray-400">·</span>
        <span>{displayData.beds || 2} beds</span>
        <span className="text-gray-400">·</span>
        <span>{displayData.baths || 1} bath{displayData.baths > 1 ? 's' : ''}</span>
      </div>

      {/* Host info */}
      <div className="flex items-center gap-4 py-6 border-t border-b">
        <div className="relative">
          <img
            src={displayData.hostImage || 'https://a0.muscache.com/defaults/user_pic-64x64.png?v=3'}
            alt={displayData.hostName || 'Host'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {displayData.hostVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <Shield className="w-4 h-4 text-blue-500 fill-current" />
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold text-base">
            Hosted by {displayData.hostName || 'John'}
          </div>
          <div className="text-sm text-gray-600">
            {displayData.hostYears || 5} years hosting
          </div>
        </div>
      </div>
    </div>
  );
}