'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';

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

interface RoomTitleHostEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomTitleHostConfig => ({
  enabled: true,
  title: 'Beautiful Room in City Center',
  location: 'San Francisco, California',
  guests: 4,
  bedrooms: 2,
  beds: 2,
  baths: 1,
  rating: 4.92,
  reviewCount: 124,
  hostName: 'John',
  hostImage: 'https://a0.muscache.com/defaults/user_pic-64x64.png?v=3',
  hostVerified: true,
  hostSuperhost: true,
  hostYears: 5,
  showShareSave: true
});

export default function RoomTitleHostEditor({ sectionId }: RoomTitleHostEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomTitleHostConfig>(getDefaultConfig());

  // Find the section
  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  // Sync with store
  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomTitleHostConfig, value: any) => {
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

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span className="font-medium text-sm">Room Title & Host</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show section</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* Room Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">Room Information</h3>
            
            <input
              type="text"
              value={localConfig.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Room title"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <input
              type="text"
              value={localConfig.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Guests</label>
                <input
                  type="number"
                  value={localConfig.guests}
                  onChange={(e) => handleChange('guests', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Bedrooms</label>
                <input
                  type="number"
                  value={localConfig.bedrooms}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Beds</label>
                <input
                  type="number"
                  value={localConfig.beds}
                  onChange={(e) => handleChange('beds', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Baths</label>
                <input
                  type="number"
                  value={localConfig.baths}
                  onChange={(e) => handleChange('baths', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 uppercase">Reviews</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Rating</label>
                <input
                  type="number"
                  value={localConfig.rating}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  max="5"
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Review count</label>
                <input
                  type="number"
                  value={localConfig.reviewCount}
                  onChange={(e) => handleChange('reviewCount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
              </div>
            </div>
          </div>

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

            <div>
              <label className="text-xs text-gray-600">Years hosting</label>
              <input
                type="number"
                value={localConfig.hostYears}
                onChange={(e) => handleChange('hostYears', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Verified host</label>
                <input
                  type="checkbox"
                  checked={localConfig.hostVerified}
                  onChange={(e) => handleChange('hostVerified', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Superhost</label>
                <input
                  type="checkbox"
                  checked={localConfig.hostSuperhost}
                  onChange={(e) => handleChange('hostSuperhost', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Share/Save buttons</label>
            <input
              type="checkbox"
              checked={localConfig.showShareSave}
              onChange={(e) => handleChange('showShareSave', e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}