'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface RoomCalendarConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  minimumNights: number;
  blockedDates: string[];
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  showPricing: boolean;
}

interface RoomCalendarEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomCalendarConfig => ({
  enabled: true,
  title: 'Select check-in date',
  subtitle: 'Add your travel dates for exact pricing',
  minimumNights: 2,
  blockedDates: [],
  pricePerNight: 125,
  cleaningFee: 45,
  serviceFee: 28,
  showPricing: true
});

export default function RoomCalendarEditor({ sectionId }: RoomCalendarEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomCalendarConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomCalendarConfig, value: any) => {
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
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-medium text-sm">Room Calendar</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show calendar</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={localConfig.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />

            <input
              type="text"
              value={localConfig.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Subtitle"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Minimum nights</label>
            <input
              type="number"
              value={localConfig.minimumNights}
              onChange={(e) => handleChange('minimumNights', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show pricing card</label>
            <input
              type="checkbox"
              checked={localConfig.showPricing}
              onChange={(e) => handleChange('showPricing', e.target.checked)}
              className="rounded"
            />
          </div>

          {localConfig.showPricing && (
            <div className="space-y-2 p-3 bg-gray-50 rounded">
              <h4 className="text-xs font-semibold text-gray-600 uppercase">Pricing</h4>
              
              <div>
                <label className="text-xs text-gray-600">Price per night</label>
                <input
                  type="number"
                  value={localConfig.pricePerNight}
                  onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Cleaning fee</label>
                <input
                  type="number"
                  value={localConfig.cleaningFee}
                  onChange={(e) => handleChange('cleaningFee', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Service fee</label>
                <input
                  type="number"
                  value={localConfig.serviceFee}
                  onChange={(e) => handleChange('serviceFee', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}