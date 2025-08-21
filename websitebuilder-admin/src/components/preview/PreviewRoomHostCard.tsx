'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Star, Award, MessageSquare, Check } from 'lucide-react';

interface RoomHostCardConfig {
  enabled: boolean;
  title: string;
  hostName: string;
  hostImage: string;
  hostSince: string;
  reviewCount: number;
  rating: number;
  responseRate: number;
  responseTime: string;
  isSuperhost: boolean;
  isVerified: boolean;
  bio: string;
  languages: string[];
  work: string;
  location: string;
}

interface PreviewRoomHostCardProps {
  config: RoomHostCardConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomHostCard({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomHostCardProps) {
  
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
          console.log('Room host data:', data.host); // Debug log
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

  // Use room data if available, fallback to config
  const displayData = roomData?.host ? {
    ...config,
    hostName: roomData.host.fullName || roomData.host.firstName || config.hostName,
    hostImage: roomData.host.profilePicture || config.hostImage,
    isVerified: roomData.host.isVerified ?? config.isVerified,
    isSuperhost: roomData.host.isSuperhost ?? config.isSuperhost,
    bio: roomData.host.bio || config.bio,
    location: roomData.host.city || config.location,
    hostSince: roomData.host.joinedDate ? 
      new Date(roomData.host.joinedDate).getFullYear().toString() : 
      config.hostSince
  } : config;

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      <h2 className="text-xl font-semibold mb-6">
        {displayData.title || 'Meet your Host'}
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Host card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={displayData.hostImage || 'https://a0.muscache.com/defaults/user_pic-225x225.png?v=3'}
                alt={displayData.hostName}
                className="w-32 h-32 rounded-full object-cover"
              />
              {displayData.isSuperhost && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
                  <Award className="w-8 h-8 text-red-500" />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-1">{displayData.hostName || 'Host'}</h3>
            {displayData.isSuperhost && (
              <p className="text-sm font-medium mb-4">Superhost</p>
            )}
          </div>

          <div className="space-y-3 mt-6 pt-6 border-t">
            {displayData.reviewCount > 0 && (
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">{displayData.reviewCount} Reviews</p>
                  {displayData.rating > 0 && (
                    <p className="text-sm text-gray-600">{displayData.rating} rating</p>
                  )}
                </div>
              </div>
            )}

            {displayData.isVerified && (
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Identity verified</p>
                </div>
              </div>
            )}

            {displayData.isSuperhost && (
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Superhost</p>
                  <p className="text-sm text-gray-600">
                    Superhosts are experienced, highly rated hosts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Host details */}
        <div className="space-y-6">
          {/* Bio */}
          {displayData.bio && (
            <div>
              <h3 className="font-semibold mb-2">About {displayData.hostName}</h3>
              <p className="text-gray-700">{displayData.bio}</p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-2">
            {displayData.location && (
              <p className="text-gray-700">
                <span className="font-medium">Lives in:</span> {displayData.location}
              </p>
            )}
            {displayData.work && (
              <p className="text-gray-700">
                <span className="font-medium">My work:</span> {displayData.work}
              </p>
            )}
            {displayData.languages && displayData.languages.length > 0 && (
              <p className="text-gray-700">
                <span className="font-medium">Speaks:</span> {displayData.languages.join(', ')}
              </p>
            )}
          </div>

          {/* Response info */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Host details</h3>
            <p className="text-gray-700">Response rate: {config.responseRate}%</p>
            <p className="text-gray-700">Response time: {config.responseTime}</p>
          </div>

          {/* Message button */}
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition">
            <MessageSquare className="w-5 h-5" />
            Message Host
          </button>

          {/* Security note */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <Shield className="w-4 h-4 inline mr-1" />
              To protect your payment, never transfer money or communicate outside of the Airbnb website or app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}