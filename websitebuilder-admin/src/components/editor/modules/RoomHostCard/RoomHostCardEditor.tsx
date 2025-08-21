'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

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

interface RoomHostCardEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomHostCardConfig => ({
  enabled: true,
  title: 'Meet your Host',
  hostName: 'Sarah',
  hostImage: '',
  hostSince: '2018',
  reviewCount: 256,
  rating: 4.95,
  responseRate: 100,
  responseTime: 'within an hour',
  isSuperhost: true,
  isVerified: true,
  bio: 'Hi! I\'m Sarah, and I love hosting guests from around the world. I\'ve been living in San Francisco for over 10 years and know all the best local spots.',
  languages: ['English', 'Spanish', 'French'],
  work: 'Interior Designer',
  location: 'San Francisco, California'
});

export default function RoomHostCardEditor({ sectionId }: RoomHostCardEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomHostCardConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomHostCardConfig, value: any) => {
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

  const handleLanguagesChange = (value: string) => {
    const languages = value.split(',').map(lang => lang.trim()).filter(lang => lang);
    handleChange('languages', languages);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium text-sm">Room Host Card</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show host card</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <input
            type="text"
            value={localConfig.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Section title"
            className="w-full px-3 py-1.5 text-sm border rounded-md"
          />

          {/* Host Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">Host Information</h3>
            
            <input
              type="text"
              value={localConfig.hostName}
              onChange={(e) => handleChange('hostName', e.target.value)}
              placeholder="Host name"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <input
              type="text"
              value={localConfig.hostImage}
              onChange={(e) => handleChange('hostImage', e.target.value)}
              placeholder="Host image URL"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <textarea
              value={localConfig.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Host bio"
              rows={3}
              className="w-full px-3 py-1.5 text-sm border rounded-md resize-none"
            />

            <input
              type="text"
              value={localConfig.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <input
              type="text"
              value={localConfig.work}
              onChange={(e) => handleChange('work', e.target.value)}
              placeholder="Work/Profession"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <input
              type="text"
              value={localConfig.languages.join(', ')}
              onChange={(e) => handleLanguagesChange(e.target.value)}
              placeholder="Languages (comma separated)"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">Host Stats</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Reviews</label>
                <input
                  type="number"
                  value={localConfig.reviewCount}
                  onChange={(e) => handleChange('reviewCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Rating</label>
                <input
                  type="number"
                  value={localConfig.rating}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  max="5"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Response rate (%)</label>
              <input
                type="number"
                value={localConfig.responseRate}
                onChange={(e) => handleChange('responseRate', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>

            <input
              type="text"
              value={localConfig.responseTime}
              onChange={(e) => handleChange('responseTime', e.target.value)}
              placeholder="Response time"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">Badges</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Superhost</label>
              <input
                type="checkbox"
                checked={localConfig.isSuperhost}
                onChange={(e) => handleChange('isSuperhost', e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Identity verified</label>
              <input
                type="checkbox"
                checked={localConfig.isVerified}
                onChange={(e) => handleChange('isVerified', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}