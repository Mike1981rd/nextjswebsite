'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Info, Plus, X } from 'lucide-react';

interface RoomThingsConfig {
  enabled: boolean;
  title: string;
  houseRules: string[];
  safetyProperty: string[];
  cancellationPolicy: string[];
  showMoreButton: boolean;
}

interface RoomThingsEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomThingsConfig => ({
  enabled: true,
  title: 'Things to know',
  houseRules: [
    'Check-in: 3:00 PM - 10:00 PM',
    'Checkout before 11:00 AM',
    'No smoking',
    'No pets',
    'No parties or events',
    'Maximum 4 guests'
  ],
  safetyProperty: [
    'Carbon monoxide alarm',
    'Smoke alarm',
    'First aid kit',
    'Fire extinguisher',
    'Lock on bedroom door'
  ],
  cancellationPolicy: [
    'Free cancellation before Feb 14',
    'After that, cancel up to 7 days before check-in and get a 50% refund',
    'No refund for cancellations within 7 days'
  ],
  showMoreButton: true
});

export default function RoomThingsEditor({ sectionId }: RoomThingsEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomThingsConfig>(getDefaultConfig());

  const section = sections.template.find(s => s.id === sectionId) ||
                  sections.headerGroup.find(s => s.id === sectionId) ||
                  sections.footerGroup.find(s => s.id === sectionId);

  useEffect(() => {
    if (section?.settings) {
      const newConfig = { ...getDefaultConfig(), ...section.settings };
      setLocalConfig(newConfig);
    }
  }, [section?.settings]);

  const handleChange = (field: keyof RoomThingsConfig, value: any) => {
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

  const handleListChange = (listName: 'houseRules' | 'safetyProperty' | 'cancellationPolicy', index: number, value: string) => {
    const newList = [...localConfig[listName]];
    newList[index] = value;
    handleChange(listName, newList);
  };

  const addItem = (listName: 'houseRules' | 'safetyProperty' | 'cancellationPolicy') => {
    handleChange(listName, [...localConfig[listName], '']);
  };

  const removeItem = (listName: 'houseRules' | 'safetyProperty' | 'cancellationPolicy', index: number) => {
    const newList = localConfig[listName].filter((_, i) => i !== index);
    handleChange(listName, newList);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span className="font-medium text-sm">Room Things to Know</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show section</label>
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

          <div className="flex items-center justify-between">
            <label className="text-sm">Show more button</label>
            <input
              type="checkbox"
              checked={localConfig.showMoreButton}
              onChange={(e) => handleChange('showMoreButton', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* House Rules */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">House Rules</h3>
              <button
                onClick={() => addItem('houseRules')}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            {localConfig.houseRules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleListChange('houseRules', index, e.target.value)}
                  placeholder="Enter rule"
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
                <button
                  onClick={() => removeItem('houseRules', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Safety & Property */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">Safety & Property</h3>
              <button
                onClick={() => addItem('safetyProperty')}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            {localConfig.safetyProperty.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('safetyProperty', index, e.target.value)}
                  placeholder="Enter safety item"
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
                <button
                  onClick={() => removeItem('safetyProperty', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">Cancellation Policy</h3>
              <button
                onClick={() => addItem('cancellationPolicy')}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            {localConfig.cancellationPolicy.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('cancellationPolicy', index, e.target.value)}
                  placeholder="Enter policy"
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
                <button
                  onClick={() => removeItem('cancellationPolicy', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}