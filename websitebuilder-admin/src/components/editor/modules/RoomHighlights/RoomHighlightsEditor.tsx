'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Sparkles, Plus, X } from 'lucide-react';

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface RoomHighlightsConfig {
  enabled: boolean;
  highlights: Highlight[];
}

interface RoomHighlightsEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomHighlightsConfig => ({
  enabled: true,
  highlights: [
    {
      id: '1',
      icon: 'Sparkles',
      title: 'Dedicated workspace',
      description: 'A room with wifi that\'s well-suited for working.'
    },
    {
      id: '2', 
      icon: 'MapPin',
      title: 'Great location',
      description: '95% of recent guests gave the location a 5-star rating.'
    },
    {
      id: '3',
      icon: 'Calendar',
      title: 'Free cancellation before Feb 14',
      description: 'Get a full refund if you change your mind.'
    }
  ]
});

export default function RoomHighlightsEditor({ sectionId }: RoomHighlightsEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomHighlightsConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomHighlightsConfig, value: any) => {
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

  const handleHighlightChange = (index: number, field: keyof Highlight, value: string) => {
    const newHighlights = [...localConfig.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    handleChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    if (localConfig.highlights.length < 3) {
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        icon: 'Star',
        title: 'New highlight',
        description: 'Add a description'
      };
      handleChange('highlights', [...localConfig.highlights, newHighlight]);
    }
  };

  const removeHighlight = (index: number) => {
    const newHighlights = localConfig.highlights.filter((_, i) => i !== index);
    handleChange('highlights', newHighlights);
  };

  const commonIcons = [
    'Sparkles', 'MapPin', 'Calendar', 'DoorOpen', 'Wifi', 'Car', 
    'Wind', 'Tv', 'Coffee', 'Home', 'Star', 'Shield', 'Award', 
    'Clock', 'Heart', 'Key', 'Mountain', 'Trees', 'Sun', 'Moon'
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">Room Highlights</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show highlights</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">Highlights (Max 3)</h3>
              {localConfig.highlights.length < 3 && (
                <button
                  onClick={addHighlight}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>

            {localConfig.highlights.map((highlight, index) => (
              <div key={highlight.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Highlight {index + 1}</span>
                  {localConfig.highlights.length > 1 && (
                    <button
                      onClick={() => removeHighlight(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-600">Icon</label>
                  <select
                    value={highlight.icon}
                    onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                  >
                    {commonIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={highlight.title}
                  onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-2 py-1 text-sm border rounded"
                />

                <textarea
                  value={highlight.description}
                  onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                  placeholder="Description"
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