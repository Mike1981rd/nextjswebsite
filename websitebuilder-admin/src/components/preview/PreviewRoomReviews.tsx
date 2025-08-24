'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart, Smile, ThumbsUp, Loader2 } from 'lucide-react';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import WriteReviewModal from '@/components/reviews/WriteReviewModal';
import { getRoomReviews, type ReviewDto, type ReviewStatisticsDto } from '@/lib/api/reviews';
import type { ColorScheme } from '@/types/theme/colorSchemes';

interface RoomReviewsConfig {
  enabled: boolean;
  colorSchemeId?: string;
  ratingIcon?: 'star' | 'heart' | 'smile' | 'like';
  ratingIconColor?: string;
  bodyType?: 'standard' | 'rounded-grid' | 'list-grid' | 'square-grid';
  cardStyle?: 'modern' | 'loox' | 'lai' | 'bordered' | 'minimal';
  cardBackgroundColor?: string;
  cardBorderColor?: string;
  headerSize?: number;
  topPadding?: number;
  bottomPadding?: number;
}

interface PreviewRoomReviewsProps {
  config: RoomReviewsConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
  roomId?: number;
}

export default function PreviewRoomReviews({ 
  config, 
  deviceView, 
  isEditor = false,
  theme,
  roomId
}: PreviewRoomReviewsProps) {
  
  const [showAll, setShowAll] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstActiveRoomId, setFirstActiveRoomId] = useState<number | null>(null);
  
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  const { config: themeConfig } = useThemeConfigStore();

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

  // Fetch first active room ID when needed (editor or no roomId provided in live)
  useEffect(() => {
    const fetchFirstActiveRoom = async () => {
      const companyId = localStorage.getItem('companyId') || '1';
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/rooms/company/${companyId}/first-active`
        );
        if (response.ok) {
          const data = await response.json();
          if (data?.id) {
            setFirstActiveRoomId(data.id);
          }
        }
      } catch (error) {
        console.error('Error fetching first active room:', error);
      }
    };

    const configRoomId = (config as any)?.roomId as number | undefined;
    // Fetch when enabled and either in editor OR no room id is provided in live
    if (config.enabled && (isEditor || (!roomId && !configRoomId))) {
      fetchFirstActiveRoom();
    }
  }, [isEditor, config.enabled, roomId, config]);

  // Load reviews when roomId (prop or config) is available or when we have firstActiveRoomId
  useEffect(() => {
    const roomIdFromConfig = (config as any)?.roomId as number | undefined;
    const effectiveRoomId = roomId || roomIdFromConfig || firstActiveRoomId;
    if (effectiveRoomId) {
      loadReviews(effectiveRoomId);
    }
  }, [roomId, firstActiveRoomId, isEditor, config]);

  // Listen to cross-tab updates (from backoffice approvals) and reload
  useEffect(() => {
    const onUpdated = () => {
      const roomIdFromConfig = (config as any)?.roomId as number | undefined;
      const effectiveRoomId = roomId || roomIdFromConfig || firstActiveRoomId;
      if (effectiveRoomId) loadReviews(effectiveRoomId);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'reviews_updated') onUpdated();
    };
    window.addEventListener('reviews:updated', onUpdated as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('reviews:updated', onUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [roomId, firstActiveRoomId]);

  const loadReviews = async (reviewRoomId: number) => {
    if (!reviewRoomId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getRoomReviews(reviewRoomId, 'Approved');
      setReviews(data.reviews);
      setStatistics(data.statistics);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews');
      // In case of error, show empty state
      setReviews([]);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Server-only guard: always ensure we end with some content in live preview
  useEffect(() => {
    if (!reviews.length && !isLoading && !error) {
      console.log('[PreviewRoomReviews] No reviews loaded; check roomId source (prop/config/firstActive).');
    }
  }, [reviews, isLoading, error]);

  const handleReviewSubmitted = () => {
    // Reload reviews after successful submission
    const configRoomId = (config as any)?.roomId as number | undefined;
    const effectiveRoomId = roomId || configRoomId || firstActiveRoomId;
    if (effectiveRoomId) {
      loadReviews(effectiveRoomId);
    }
  };

  if (!config.enabled) {
    return null;
  }

  // Get configuration values with defaults
  const colorSchemeId = config.colorSchemeId || 'scheme-1';
  const ratingIcon = config.ratingIcon || 'star';
  const ratingIconColor = config.ratingIconColor || '#FFB800';
  const bodyType = config.bodyType || 'standard';
  const cardStyle = config.cardStyle || 'modern';
  const headerSize = config.headerSize || 32;
  const topPadding = config.topPadding || 40;
  const bottomPadding = config.bottomPadding || 40;

  // Get the selected color scheme from theme config
  const colorScheme = themeConfig?.colorSchemes?.schemes?.find(s => s.id === colorSchemeId) || null;
  
  // Use color scheme colors or fallback to defaults
  const bgColor = colorScheme?.background || '#FFFFFF';
  const textColor = colorScheme?.text || '#000000';
  const borderColor = colorScheme?.border || '#E5E7EB';
  const outlineButtonColor = colorScheme?.outlineButton || '#000000';
  const outlineButtonText = colorScheme?.outlineButtonText || '#000000';

  // Card colors (derive after borderColor is available)
  const cardBg = config.cardBackgroundColor || bgColor;
  const cardBorder = config.cardBorderColor || borderColor;

  // Calculate display values
  const averageRating = statistics?.averageRating || 0;
  const totalReviews = statistics?.totalReviews || 0;
  const reviewsPerPage = isMobile ? 2 : 4;
  const displayedReviews = showAll ? reviews : reviews.slice(0, reviewsPerPage);

  const RatingIcon = ({ filled, size = 'sm' }: { filled: boolean; size?: 'sm' | 'lg' }) => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';
    const iconProps = {
      className: sizeClass,
      style: { 
        color: filled ? ratingIconColor : borderColor,
        fill: filled ? ratingIconColor : borderColor
      }
    };

    switch(ratingIcon) {
      case 'heart': return <Heart {...iconProps} />;
      case 'smile': return <Smile {...iconProps} />;
      case 'like': return <ThumbsUp {...iconProps} />;
      default: return <Star {...iconProps} />;
    }
  };

  const getBodyClasses = () => {
    switch(bodyType) {
      case 'rounded-grid':
        return { 
          wrapper: 'rounded-xl p-4',
          style: { backgroundColor: `${cardBg}`, border: `1px solid ${cardBorder}` }
        };
      case 'list-grid':
        return { 
          wrapper: 'pb-4',
          style: { borderBottom: `1px solid ${cardBorder}` }
        };
      case 'square-grid':
        return { 
          wrapper: 'p-4',
          style: { border: `1px solid ${cardBorder}`, backgroundColor: `${cardBg}` }
        };
      default:
        return { wrapper: '', style: { backgroundColor: `${cardBg}` } };
    }
  };

  const bodyClasses = getBodyClasses();
  const styleClassesByPreset: Record<string, string> = {
    modern: 'shadow-md hover:shadow-lg transition-shadow',
    loox: 'rounded-2xl shadow-sm border',
    lai: 'rounded-xl border',
    bordered: 'border',
    minimal: ''
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const getApiOrigin = () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api';
    try {
      return new URL(api).origin;
    } catch {
      return 'http://localhost:5266';
    }
  };

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return '';
    // If it's an absolute URL, return as is
    if (/^https?:\/\//i.test(url)) return url;
    // If it's a relative upload path, prefix with API origin
    if (url.startsWith('/uploads/')) return `${getApiOrigin()}${url}`;
    if (url.startsWith('uploads/')) return `${getApiOrigin()}/${url}`;
    return url;
  };

  return (
    <div 
      className="container mx-auto px-6"
      style={{ 
        paddingTop: `${topPadding}px`,
        paddingBottom: `${bottomPadding}px`,
        backgroundColor: bgColor
      }}
    >
      {/* Header with average rating and Write Review button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {totalReviews > 0 && <RatingIcon filled={true} size="lg" />}
          <h2 
            className="font-semibold"
            style={{ 
              fontSize: `${headerSize}px`,
              color: textColor
            }}
          >
            {totalReviews > 0 ? (
              `${averageRating.toFixed(2)} · ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`
            ) : (
              'No reviews yet'
            )}
          </h2>
        </div>
        {/* Show button in editor for preview purposes, functional on live site */}
        <button
          onClick={() => setShowWriteReview(true)}
          className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90 text-sm"
          style={{ 
            border: `1px solid ${outlineButtonColor}`,
            color: outlineButtonText,
            backgroundColor: 'transparent'
          }}
        >
          Write a review
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: borderColor }} />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8" style={{ color: textColor }}>
          <p className="opacity-70">Unable to load reviews at this time.</p>
        </div>
      )}

      {/* Reviews Grid */}
      {!isLoading && !error && reviews.length > 0 && (
        <>
          <div className={`grid ${isMobile ? 'grid-cols-1' : bodyType === 'list-grid' ? 'grid-cols-1' : 'grid-cols-2'} gap-x-12 gap-y-6 mb-6`}>
            {displayedReviews.map((review) => (
              <div 
                key={review.id} 
                className={`space-y-3 ${bodyClasses.wrapper} ${styleClassesByPreset[cardStyle]}`}
                style={bodyClasses.style}
              >
                <div className="flex items-center gap-3">
                  {review.customer?.avatarUrl ? (
                    <img
                      src={resolveImageUrl(review.customer.avatarUrl)}
                      alt={review.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: `1px solid ${cardBorder}` }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : review.media && review.media.length > 0 ? (
                    <img
                      src={resolveImageUrl(review.media[0].thumbnailUrl || review.media[0].mediaUrl)}
                      alt={review.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: `1px solid ${cardBorder}` }}
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm"
                      style={{ 
                        backgroundColor: ratingIconColor + '20',
                        color: ratingIconColor
                      }}
                    >
                      {getInitials(review.authorName)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm" style={{ color: textColor }}>
                      {review.authorName}
                    </p>
                    <p className="text-xs opacity-70" style={{ color: textColor }}>
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <RatingIcon key={i} filled={i < review.rating} />
                  ))}
                </div>

                {review.title && (
                  <p className="font-medium text-sm" style={{ color: textColor }}>
                    {review.title}
                  </p>
                )}

                <p className="text-sm line-clamp-3 opacity-90" style={{ color: textColor }}>
                  {review.content}
                </p>

                {/* Display review images if any */}
                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.media.slice(0, 3).map((media) => (
                      <img
                        key={media.id}
                        src={resolveImageUrl(media.thumbnailUrl || media.mediaUrl)}
                        alt={media.caption || 'Review image'}
                        className="w-16 h-16 object-cover rounded"
                        style={{ border: `1px solid ${borderColor}` }}
                      />
                    ))}
                  </div>
                )}

                {/* Business Reply */}
                {review.businessReply && (
                  <div 
                    className="mt-3 p-3 rounded-lg"
                    style={{ backgroundColor: `${borderColor}10` }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: textColor }}>
                      Response from the owner
                    </p>
                    <p className="text-sm opacity-90" style={{ color: textColor }}>
                      {review.businessReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show all button */}
          {reviews.length > reviewsPerPage && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-lg font-medium transition hover:opacity-90"
              style={{ 
                border: `1px solid ${outlineButtonColor}`,
                color: outlineButtonText,
                backgroundColor: 'transparent'
              }}
            >
              {showAll ? 'Show less' : `Show all ${totalReviews} reviews`}
            </button>
          )}
        </>
      )}

      {/* Empty State for Editor - only show if there are no reviews */}
      {isEditor && !isLoading && reviews.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor }}>
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            {firstActiveRoomId 
              ? "No reviews yet for this room. Reviews will appear here when customers submit them."
              : "No active room found. Please create and activate a room first."}
          </p>
          <p className="text-xs opacity-50 mt-2" style={{ color: textColor }}>
            This is a preview showing data from the first active room.
          </p>
        </div>
      )}

      {/* Empty State for Live Site */}
      {!isEditor && !isLoading && !error && reviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm opacity-70 mb-4" style={{ color: textColor }}>
            Be the first to share your experience!
          </p>
          {roomId && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="px-6 py-3 rounded-lg font-medium transition hover:opacity-90"
              style={{ 
                backgroundColor: ratingIconColor,
                color: '#FFFFFF'
              }}
            >
              Write the first review
            </button>
          )}
        </div>
      )}

      {/* Write Review Modal */}
      {(roomId || firstActiveRoomId) && (
        <WriteReviewModal
          isOpen={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          onSuccess={handleReviewSubmitted}
          roomId={roomId || firstActiveRoomId!}
          ratingIcon={ratingIcon}
          ratingIconColor={ratingIconColor}
          colorScheme={colorScheme}
        />
      )}
    </div>
  );
}