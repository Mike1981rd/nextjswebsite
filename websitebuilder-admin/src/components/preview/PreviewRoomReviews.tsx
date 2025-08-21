'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

interface RoomReviewsConfig {
  enabled: boolean;
  title: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  showAllButton: boolean;
}

interface PreviewRoomReviewsProps {
  config: RoomReviewsConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomReviews({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomReviewsProps) {
  
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

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

  if (!config.enabled || config.reviews.length === 0) {
    return null;
  }

  const reviewsPerPage = isMobile ? 2 : 6;
  const displayedReviews = showAll 
    ? config.reviews 
    : config.reviews.slice(0, reviewsPerPage);

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      {/* Header with average rating */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-6 h-6 fill-current" />
        <h2 className="text-xl font-semibold">
          {config.averageRating} · {config.totalReviews} reviews
        </h2>
      </div>

      {/* Reviews grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-x-12 gap-y-6 mb-6`}>
        {displayedReviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={review.avatar || 'https://a0.muscache.com/defaults/user_pic-50x50.png?v=3'}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{review.author}</p>
                <p className="text-xs text-gray-600">{review.date}</p>
              </div>
            </div>
            
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'fill-gray-200'}`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-700 line-clamp-3">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Show all button */}
      {config.showAllButton && config.reviews.length > reviewsPerPage && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          {showAll ? 'Show less' : `Show all ${config.totalReviews} reviews`}
        </button>
      )}
    </div>
  );
}