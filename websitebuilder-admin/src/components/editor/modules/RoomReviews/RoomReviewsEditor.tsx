'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import { ChevronDown, ChevronUp, Star, Heart, Smile, ThumbsUp } from 'lucide-react';
import type { ColorScheme } from '@/types/theme/colorSchemes';

interface RoomReviewsConfig {
  enabled: boolean;
  colorSchemeId: string; // ID of the selected color scheme (scheme-1 to scheme-5)
  ratingIcon: 'star' | 'heart' | 'smile' | 'like';
  ratingIconColor: string;
  bodyType: 'standard' | 'rounded-grid' | 'list-grid' | 'square-grid';
  headerSize: number;
  topPadding: number;
  bottomPadding: number;
}

interface RoomReviewsEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomReviewsConfig => ({
  enabled: true,
  colorSchemeId: 'scheme-1',
  ratingIcon: 'star',
  ratingIconColor: '#FFB800',
  bodyType: 'standard',
  headerSize: 32,
  topPadding: 40,
  bottomPadding: 40
});

export default function RoomReviewsEditor({ sectionId }: RoomReviewsEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const { config: themeConfig } = useThemeConfigStore();
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

  const RatingIconPreview = () => {
    const iconProps = { 
      className: "w-4 h-4", 
      style: { color: localConfig.ratingIconColor },
      fill: localConfig.ratingIconColor
    };
    
    switch(localConfig.ratingIcon) {
      case 'heart': return <Heart {...iconProps} />;
      case 'smile': return <Smile {...iconProps} />;
      case 'like': return <ThumbsUp {...iconProps} />;
      default: return <Star {...iconProps} />;
    }
  };

  // Get color schemes from theme config or use defaults
  const colorSchemes = themeConfig?.colorSchemes?.schemes || [];
  const hasColorSchemes = colorSchemes.length > 0;

  // Get selected color scheme details
  const selectedScheme = colorSchemes.find(s => s.id === localConfig.colorSchemeId);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Reviews</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* Color Scheme */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Color Scheme
            </label>
            {hasColorSchemes ? (
              <div className="space-y-2">
                <select
                  value={localConfig.colorSchemeId}
                  onChange={(e) => handleChange('colorSchemeId', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700"
                >
                  {colorSchemes.map((scheme, index) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name || `Scheme ${index + 1}`}
                    </option>
                  ))}
                </select>
                
                {/* Color Scheme Preview */}
                {selectedScheme && (
                  <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Color Preview
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedScheme.background }}
                        />
                        <span className="text-xs">Background</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedScheme.text }}
                        />
                        <span className="text-xs">Text</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedScheme.solidButton }}
                        />
                        <span className="text-xs">Button</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: selectedScheme.link }}
                        />
                        <span className="text-xs">Link</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                No color schemes configured. Please configure color schemes in Global Settings first.
              </div>
            )}
          </div>

          {/* Rating Icon */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Rating Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'star', icon: Star, label: 'Star' },
                { value: 'heart', icon: Heart, label: 'Heart' },
                { value: 'smile', icon: Smile, label: 'Smile' },
                { value: 'like', icon: ThumbsUp, label: 'Like' }
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => handleChange('ratingIcon', item.value)}
                  className={`p-2 border rounded-md flex flex-col items-center gap-1 transition-colors ${
                    localConfig.ratingIcon === item.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Icon Color */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Rating Icon Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localConfig.ratingIconColor}
                onChange={(e) => handleChange('ratingIconColor', e.target.value)}
                className="w-10 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={localConfig.ratingIconColor}
                onChange={(e) => handleChange('ratingIconColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="#FFB800"
              />
              <div className="w-10 h-10 flex items-center justify-center border rounded">
                <RatingIconPreview />
              </div>
            </div>
          </div>

          {/* Body Type */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Body Type
            </label>
            <select
              value={localConfig.bodyType}
              onChange={(e) => handleChange('bodyType', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="standard">Standard</option>
              <option value="rounded-grid">Rounded Grid</option>
              <option value="list-grid">List Grid</option>
              <option value="square-grid">Square Grid</option>
            </select>
          </div>

          {/* Header Size */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Header Size: {localConfig.headerSize}px
            </label>
            <input
              type="range"
              min="20"
              max="48"
              value={localConfig.headerSize}
              onChange={(e) => handleChange('headerSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20px</span>
              <span>48px</span>
            </div>
          </div>

          {/* Top Padding */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Top Padding: {localConfig.topPadding}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localConfig.topPadding}
              onChange={(e) => handleChange('topPadding', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>100px</span>
            </div>
          </div>

          {/* Bottom Padding */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
              Bottom Padding: {localConfig.bottomPadding}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localConfig.bottomPadding}
              onChange={(e) => handleChange('bottomPadding', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>100px</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}