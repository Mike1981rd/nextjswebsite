'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Sparkles, Plus, X } from 'lucide-react';

interface Amenity {
  id: string;
  icon: string;
  name: string;
  available: boolean;
}

interface RoomAmenitiesConfig {
  enabled: boolean;
  title: string;
  amenities: Amenity[];
  columns: number;
  showUnavailable: boolean;
}

interface RoomAmenitiesEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomAmenitiesConfig => ({
  enabled: true,
  title: 'What this place offers',
  amenities: [
    { id: '1', icon: 'Wifi', name: 'Wifi', available: true },
    { id: '2', icon: 'Tv', name: 'TV', available: true },
    { id: '3', icon: 'Utensils', name: 'Kitchen', available: true },
    { id: '4', icon: 'Car', name: 'Free parking', available: true },
    { id: '5', icon: 'Wind', name: 'Air conditioning', available: true },
    { id: '6', icon: 'Dumbbell', name: 'Gym', available: false },
    { id: '7', icon: 'Trees', name: 'Garden view', available: true },
    { id: '8', icon: 'Coffee', name: 'Coffee maker', available: true },
    { id: '9', icon: 'Bath', name: 'Bathtub', available: true },
    { id: '10', icon: 'Flame', name: 'Heating', available: true }
  ],
  columns: 2,
  showUnavailable: true
});

export default function RoomAmenitiesEditor({ sectionId }: RoomAmenitiesEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
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

  const handleAmenityChange = (index: number, field: keyof Amenity, value: any) => {
    const newAmenities = [...localConfig.amenities];
    newAmenities[index] = { ...newAmenities[index], [field]: value };
    handleChange('amenities', newAmenities);
  };

  const addAmenity = () => {
    const newAmenity: Amenity = {
      id: Date.now().toString(),
      icon: 'Star',
      name: 'New amenity',
      available: true
    };
    handleChange('amenities', [...localConfig.amenities, newAmenity]);
  };

  const removeAmenity = (index: number) => {
    const newAmenities = localConfig.amenities.filter((_, i) => i !== index);
    handleChange('amenities', newAmenities);
  };

  const commonIcons = [
    'Wifi', 'Tv', 'Car', 'Wind', 'Coffee', 'Utensils', 
    'Dumbbell', 'Trees', 'Bath', 'Flame', 'Star', 'Shield',
    'Home', 'Heart', 'Key', 'Mountain', 'Sun', 'Moon'
  ];

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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show amenities</label>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 uppercase">Amenities</h3>
              <button
                onClick={addAmenity}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {localConfig.amenities.map((amenity, index) => (
                <div key={amenity.id} className="flex gap-2 items-center p-2 border rounded">
                  <select
                    value={amenity.icon}
                    onChange={(e) => handleAmenityChange(index, 'icon', e.target.value)}
                    className="w-20 px-1 py-1 text-xs border rounded"
                  >
                    {commonIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={amenity.name}
                    onChange={(e) => handleAmenityChange(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border rounded"
                  />
                  <input
                    type="checkbox"
                    checked={amenity.available}
                    onChange={(e) => handleAmenityChange(index, 'available', e.target.checked)}
                    className="rounded"
                  />
                  <button
                    onClick={() => removeAmenity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}