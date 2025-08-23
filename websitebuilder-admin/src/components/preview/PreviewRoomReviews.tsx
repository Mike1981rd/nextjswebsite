'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart, Smile, ThumbsUp, X, ImagePlus } from 'lucide-react';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import type { ColorScheme } from '@/types/theme/colorSchemes';

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
  colorSchemeId?: string; // ID of the selected color scheme
  ratingIcon?: 'star' | 'heart' | 'smile' | 'like';
  ratingIconColor?: string;
  bodyType?: 'standard' | 'rounded-grid' | 'list-grid' | 'square-grid';
  headerSize?: number;
  topPadding?: number;
  bottomPadding?: number;
  // Legacy fields for backward compatibility
  title?: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
  showAllButton?: boolean;
}

interface PreviewRoomReviewsProps {
  config: RoomReviewsConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratingIcon: 'star' | 'heart' | 'smile' | 'like';
  ratingIconColor: string;
  colorScheme: ColorScheme | null;
}

// Default sample reviews for display
const defaultReviews: Review[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    avatar: '',
    date: 'December 2023',
    rating: 5,
    comment: 'Amazing stay! The location was perfect and the host was incredibly responsive. The apartment had everything we needed and was spotlessly clean.'
  },
  {
    id: '2',
    author: 'Michael Chen',
    avatar: '',
    date: 'November 2023',
    rating: 5,
    comment: 'Beautiful apartment with stunning views. The amenities were top-notch and the check-in process was seamless. Would definitely stay again!'
  },
  {
    id: '3',
    author: 'Emma Davis',
    avatar: '',
    date: 'October 2023',
    rating: 4,
    comment: 'Great place for a weekend getaway. Very comfortable and well-equipped. The only minor issue was street noise at night, but earplugs were provided.'
  },
  {
    id: '4',
    author: 'James Wilson',
    avatar: '',
    date: 'September 2023',
    rating: 5,
    comment: 'Exceeded our expectations! The photos don\'t do it justice. The host went above and beyond to make our stay memorable.'
  }
];

function WriteReviewModal({ isOpen, onClose, ratingIcon, ratingIconColor, colorScheme }: WriteReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const RatingIcon = ({ filled, hovered }: { filled: boolean; hovered: boolean }) => {
    const iconProps = {
      className: "w-8 h-8 cursor-pointer transition-all",
      style: { 
        color: filled || hovered ? ratingIconColor : '#E5E7EB',
        fill: filled ? ratingIconColor : hovered ? `${ratingIconColor}50` : 'none'
      }
    };

    switch(ratingIcon) {
      case 'heart': return <Heart {...iconProps} />;
      case 'smile': return <Smile {...iconProps} />;
      case 'like': return <ThumbsUp {...iconProps} />;
      default: return <Star {...iconProps} />;
    }
  };

  const bgColor = colorScheme?.background || '#FFFFFF';
  const textColor = colorScheme?.text || '#000000';
  const borderColor = colorScheme?.border || '#E5E7EB';
  const buttonBg = colorScheme?.solidButton || ratingIconColor;
  const buttonText = colorScheme?.solidButtonText || '#FFFFFF';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: bgColor }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: textColor }}>
            Escribe una reseña
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition hover:opacity-80"
            style={{ backgroundColor: `${borderColor}20` }}
          >
            <X className="w-5 h-5" style={{ color: textColor }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: textColor }}>
              Tu clasificación
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(value)}
                >
                  <RatingIcon 
                    filled={value <= rating} 
                    hovered={value <= hoveredRating && value > rating}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: `${borderColor}20`,
                  border: `1px solid ${borderColor}`,
                  color: textColor
                }}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: `${borderColor}20`,
                  border: `1px solid ${borderColor}`,
                  color: textColor
                }}
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <textarea
              placeholder="Ingrese sus comentarios aquí"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ 
                backgroundColor: `${borderColor}20`,
                border: `1px solid ${borderColor}`,
                color: textColor
              }}
            />
          </div>

          {/* Add Photo */}
          <button 
            className="flex items-center gap-2 transition hover:opacity-80"
            style={{ color: colorScheme?.link || textColor }}
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-sm">Añadir foto</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={() => {
              // Handle submission
              console.log({ rating, name, email, comment });
              onClose();
            }}
            className="w-full py-3 font-medium rounded-lg transition hover:opacity-90"
            style={{ 
              backgroundColor: buttonBg,
              color: buttonText
            }}
          >
            Enviar opinión
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreviewRoomReviews({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomReviewsProps) {
  
  const [showAll, setShowAll] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
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

  if (!config.enabled) {
    return null;
  }

  // Use provided reviews or default ones
  const reviews = config.reviews || defaultReviews;
  const averageRating = config.averageRating || 4.73;
  const totalReviews = config.totalReviews || reviews.length;
  
  // Get configuration values with defaults
  const colorSchemeId = config.colorSchemeId || 'scheme-1';
  const ratingIcon = config.ratingIcon || 'star';
  const ratingIconColor = config.ratingIconColor || '#FFB800';
  const bodyType = config.bodyType || 'standard';
  const headerSize = config.headerSize || 32;
  const topPadding = config.topPadding || 40;
  const bottomPadding = config.bottomPadding || 40;

  // Get the selected color scheme from theme config
  const colorScheme = themeConfig?.colorSchemes?.schemes?.find(s => s.id === colorSchemeId) || null;
  
  // Use color scheme colors or fallback to defaults
  const bgColor = colorScheme?.background || '#FFFFFF';
  const textColor = colorScheme?.text || '#000000';
  const borderColor = colorScheme?.border || '#E5E7EB';
  const linkColor = colorScheme?.link || '#0066CC';
  const solidButtonBg = colorScheme?.solidButton || '#000000';
  const solidButtonText = colorScheme?.solidButtonText || '#FFFFFF';
  const outlineButtonColor = colorScheme?.outlineButton || '#000000';
  const outlineButtonText = colorScheme?.outlineButtonText || '#000000';

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
          style: { backgroundColor: `${borderColor}10` }
        };
      case 'list-grid':
        return { 
          wrapper: 'pb-4',
          style: { borderBottom: `1px solid ${borderColor}` }
        };
      case 'square-grid':
        return { 
          wrapper: 'p-4',
          style: { border: `1px solid ${borderColor}` }
        };
      default:
        return { wrapper: '', style: {} };
    }
  };

  const bodyClasses = getBodyClasses();

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
          <RatingIcon filled={true} size="lg" />
          <h2 
            className="font-semibold"
            style={{ 
              fontSize: `${headerSize}px`,
              color: textColor
            }}
          >
            {averageRating} · {totalReviews} reviews
          </h2>
        </div>
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

      {/* Reviews grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : bodyType === 'list-grid' ? 'grid-cols-1' : 'grid-cols-2'} gap-x-12 gap-y-6 mb-6`}>
        {displayedReviews.map((review) => (
          <div 
            key={review.id} 
            className={`space-y-3 ${bodyClasses.wrapper}`}
            style={bodyClasses.style}
          >
            <div className="flex items-center gap-3">
              <img
                src={review.avatar || 'https://a0.muscache.com/defaults/user_pic-50x50.png?v=3'}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm" style={{ color: textColor }}>
                  {review.author}
                </p>
                <p className="text-xs opacity-70" style={{ color: textColor }}>
                  {review.date}
                </p>
              </div>
            </div>
            
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <RatingIcon key={i} filled={i < review.rating} />
              ))}
            </div>

            <p className="text-sm line-clamp-3 opacity-90" style={{ color: textColor }}>
              {review.comment}
            </p>
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

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        ratingIcon={ratingIcon}
        ratingIconColor={ratingIconColor}
        colorScheme={colorScheme}
      />
    </div>
  );
}