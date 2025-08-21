'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface RoomDescriptionConfig {
  enabled: boolean;
  description: string;
  showMore: boolean;
  maxLines: number;
}

interface RoomDescriptionEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomDescriptionConfig => ({
  enabled: true,
  description: `This stylish apartment is perfect for your San Francisco stay. Located in the heart of the city, you'll be within walking distance of the best restaurants, cafes, and attractions.

The space features modern amenities, comfortable furnishings, and plenty of natural light. The fully equipped kitchen allows you to prepare your own meals, while the cozy living area is perfect for relaxing after a day of exploring.

Whether you're here for business or pleasure, this apartment provides the perfect home base for your San Francisco adventure.`,
  showMore: true,
  maxLines: 3
});

export default function RoomDescriptionEditor({ sectionId }: RoomDescriptionEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomDescriptionConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomDescriptionConfig, value: any) => {
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
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Room Description</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show description</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={localConfig.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter room description..."
              rows={8}
              className="w-full px-3 py-2 text-sm border rounded-md resize-none"
            />
            <p className="text-xs text-gray-500">
              {localConfig.description.length} characters
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Show more/less button</label>
            <input
              type="checkbox"
              checked={localConfig.showMore}
              onChange={(e) => handleChange('showMore', e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}