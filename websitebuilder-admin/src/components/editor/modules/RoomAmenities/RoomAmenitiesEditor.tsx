'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface RoomAmenitiesConfig {
  enabled: boolean;
  colorScheme: string;
  title: string;
  columns: number;
  showUnavailable: boolean;
  iconSize: number;
}

interface RoomAmenitiesEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomAmenitiesConfig => ({
  enabled: true,
  colorScheme: '1',
  title: 'What this place offers',
  columns: 2,
  showUnavailable: true,
  iconSize: 24
});

export default function RoomAmenitiesEditor({ sectionId }: RoomAmenitiesEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const { config: themeConfig } = useThemeConfigStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomAmenitiesConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomAmenitiesConfig, value: any) => {
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
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">Room Amenities</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          {/* Color Scheme Selector - PRIMERA OPCIÓN */}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Color scheme
            </label>
            <select 
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 
                         dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={localConfig.colorScheme}
              onChange={(e) => handleChange('colorScheme', e.target.value)}
            >
              {themeConfig?.colorSchemes?.schemes?.map((scheme, index) => (
                <option key={scheme.id} value={String(index + 1)}>
                  {scheme.name}
                </option>
              )) || [1, 2, 3, 4, 5].map(num => (
                <option key={num} value={String(num)}>Scheme {num}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Uses the color scheme from global settings
            </p>
          </div>

          {/* Icon Size Slider */}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Icon size
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="16"
                max="64"
                step="4"
                value={localConfig.iconSize}
                onChange={(e) => handleChange('iconSize', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px]">
                {localConfig.iconSize}px
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
              <span>Extra</span>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            value={localConfig.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Section title"
            className="w-full px-3 py-1.5 text-sm border rounded-md"
          />

          {/* Columns and Show unavailable */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Columns</label>
              <select
                value={localConfig.columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={localConfig.showUnavailable}
                  onChange={(e) => handleChange('showUnavailable', e.target.checked)}
                  className="rounded"
                />
                Show unavailable
              </label>
            </div>
          </div>

          {/* Nota informativa sobre las amenidades */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Amenities are automatically loaded from the room data. 
              You can manage amenities in the room configuration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}