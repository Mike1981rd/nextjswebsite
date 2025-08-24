'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Star, Award, MessageSquare, Check } from 'lucide-react';
import { fetchRoomData } from '@/lib/api/rooms';

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
  const [hostData, setHostData] = useState<any>(null);
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
    const loadRoomData = async () => {
      const companyId = localStorage.getItem('companyId') || '1';
      
      setLoading(true);
      try {
        // Use helper function that checks for slug
        const data = await fetchRoomData(companyId);
        if (data) {
          console.log('Room host data:', data.host); // Debug log
          setRoomData(data);
          
          // If room has hostId, fetch complete host data
          if (data.hostId) {
            try {
              const hostResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/hosts/by-room/${data.id}`
              );
              if (hostResponse.ok) {
                const fullHostData = await hostResponse.json();
                console.log('Full host data fetched:', fullHostData); // Debug log
                setHostData(fullHostData);
              }
            } catch (hostError) {
              console.error('Error fetching host data:', hostError);
              setHostData(data.host);
            }
          } else if (data.host) {
            setHostData(data.host);
          }
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch in both editor and preview modes
    if (config.enabled) {
      loadRoomData();
    }
  }, [config.enabled]);

  if (!config.enabled) {
    return null;
  }

  // Use host data from fetch or fallback to room data/config
  const currentHost = hostData || roomData?.host;
  
  // Calculate years hosting
  const getHostingYears = () => {
    const currentYear = new Date().getFullYear();
    
    if (currentHost?.yearStartedHosting) {
      return currentHost.yearStartedHosting;
    }
    
    if (currentHost?.joinedDate) {
      return new Date(currentHost.joinedDate).getFullYear();
    }
    
    return currentYear;
  };
  
  const displayData: any = currentHost ? {
    ...config,
    hostName: currentHost.fullName || currentHost.firstName || config.hostName,
    hostImage: currentHost.profilePicture || config.hostImage,
    isVerified: currentHost.isVerified ?? config.isVerified,
    isSuperhost: currentHost.isSuperhost ?? config.isSuperhost,
    bio: currentHost.bio || config.bio,
    aboutMe: currentHost.aboutMe || '',
    location: currentHost.location || currentHost.city || config.location,
    work: currentHost.work || config.work,
    languages: currentHost.languages || config.languages || [],
    attributes: currentHost.attributes || [],
    hobbies: currentHost.hobbies || [],
    hostSince: getHostingYears().toString(),
    responseTime: currentHost.responseTimeMinutes || config.responseTime,
    acceptanceRate: currentHost.acceptanceRate || config.responseRate,
    reviewCount: currentHost.totalReviews || config.reviewCount,
    rating: currentHost.overallRating || config.rating
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

          {/* About Me - Extended Bio */}
          {displayData.aboutMe && (
            <div>
              <h3 className="font-semibold mb-2">More about me</h3>
              <p className="text-gray-700">{displayData.aboutMe}</p>
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
                <span className="font-medium">Speaks:</span> {
                  Array.isArray(displayData.languages) 
                    ? displayData.languages.join(', ')
                    : displayData.languages
                }
              </p>
            )}
          </div>

          {/* Attributes */}
          {displayData.attributes && displayData.attributes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">My attributes</h3>
              <div className="flex flex-wrap gap-2">
                {displayData.attributes.map((attr: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {displayData.hobbies && displayData.hobbies.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">My hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {displayData.hobbies.map((hobby: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Response info */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Host details</h3>
            {displayData.acceptanceRate > 0 && (
              <p className="text-gray-700">Response rate: {displayData.acceptanceRate}%</p>
            )}
            {displayData.responseTime && (
              <p className="text-gray-700">Response time: {
                typeof displayData.responseTime === 'number' 
                  ? `${displayData.responseTime} minutes`
                  : displayData.responseTime
              }</p>
            )}
            {displayData.hostSince && (
              <p className="text-gray-700">Hosting since: {displayData.hostSince}</p>
            )}
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