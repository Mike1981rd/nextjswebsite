'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Star, Plus, X } from 'lucide-react';

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

interface RoomReviewsEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomReviewsConfig => ({
  enabled: true,
  title: 'Guest reviews',
  averageRating: 4.92,
  totalReviews: 124,
  reviews: [
    {
      id: '1',
      author: 'Sarah',
      avatar: '',
      date: 'December 2023',
      rating: 5,
      comment: 'Great place to stay! The location was perfect and the host was very responsive.'
    },
    {
      id: '2',
      author: 'John',
      avatar: '',
      date: 'November 2023',
      rating: 5,
      comment: 'Beautiful apartment with all the amenities needed. Would definitely stay again!'
    }
  ],
  showAllButton: true
});

export default function RoomReviewsEditor({ sectionId }: RoomReviewsEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomReviewsConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomReviewsConfig, value: any) => {
    const updatedConfig = {
      ...localConfig,
      [field]: value
    };
    
    setLocalConfig(updatedConfig);
    
    if (section) {
      const groupId = Object.keys(sections).find(key => 
        sections[key as keyof typeof sections].includes(section)
      ) || 'template';
      
      updateSectionSettings(groupId as any, section.id, updatedConfig);
    }
  };

  const handleReviewChange = (index: number, field: keyof Review, value: any) => {
    const newReviews = [...localConfig.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    handleChange('reviews', newReviews);
  };

  const addReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      author: 'Guest',
      avatar: '',
      date: 'December 2023',
      rating: 5,
      comment: 'Great stay!'
    };
    handleChange('reviews', [...localConfig.reviews, newReview]);
  };

  const removeReview = (index: number) => {
    const newReviews = localConfig.reviews.filter((_, i) => i !== index);
    handleChange('reviews', newReviews);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="font-medium text-sm">Room Reviews</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show reviews</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Average rating</label>
              <input
                type="number"
                value={localConfig.averageRating}
                onChange={(e) => handleChange('averageRating', parseFloat(e.target.value))}
                step="0.01"
                min="0"
                max="5"
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Total reviews</label>
              <input
                type="number"
                value={localConfig.totalReviews}
                onChange={(e) => handleChange('totalReviews', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Show all button</label>
            <input
              type="checkbox"
              checked={localConfig.showAllButton}
              onChange={(e) => handleChange('showAllButton', e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">Reviews</h3>
              <button
                onClick={addReview}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            {localConfig.reviews.map((review, index) => (
              <div key={review.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Review {index + 1}</span>
                  <button
                    onClick={() => removeReview(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <input
                  type="text"
                  value={review.author}
                  onChange={(e) => handleReviewChange(index, 'author', e.target.value)}
                  placeholder="Author name"
                  className="w-full px-2 py-1 text-sm border rounded"
                />

                <input
                  type="text"
                  value={review.date}
                  onChange={(e) => handleReviewChange(index, 'date', e.target.value)}
                  placeholder="Date"
                  className="w-full px-2 py-1 text-sm border rounded"
                />

                <div>
                  <label className="text-xs text-gray-600">Rating</label>
                  <select
                    value={review.rating}
                    onChange={(e) => handleReviewChange(index, 'rating', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-sm border rounded"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} stars</option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={review.comment}
                  onChange={(e) => handleReviewChange(index, 'comment', e.target.value)}
                  placeholder="Review comment"
                  rows={2}
                  className="w-full px-2 py-1 text-sm border rounded resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}