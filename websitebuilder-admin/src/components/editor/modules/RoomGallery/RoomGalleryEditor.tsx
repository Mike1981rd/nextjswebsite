'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ChevronDown, ChevronUp, Upload, X, Grid3x3, Image } from 'lucide-react';

interface RoomGalleryConfig {
  enabled: boolean;
  roomId?: number;
  images: string[];
  layoutStyle: 'airbnb' | 'grid' | 'carousel';
  cornerRadius: 'none' | 'small' | 'medium' | 'large';
  showAllPhotosButton: boolean;
  autoFetch: boolean;
}

interface RoomGalleryEditorProps {
  sectionId: string;
}

const getDefaultConfig = (): RoomGalleryConfig => ({
  enabled: true,
  roomId: undefined,
  images: [
    "https://a0.muscache.com/im/pictures/miso/Hosting-52250898/original/f2563160-2ae7-4e77-ba23-ddc37eb69a16.jpeg?w=1200",
    "https://a0.muscache.com/im/pictures/miso/Hosting-52250898/original/bd736170-1ade-409f-85f9-a83e607efa66.jpeg?w=800",
    "https://a0.muscache.com/im/pictures/miso/Hosting-52250898/original/76e5f102-3099-42f5-997e-3fb1bb9c2c6e.jpeg?w=800",
    "https://a0.muscache.com/im/pictures/miso/Hosting-52250898/original/889862f5-5804-4b68-ab1e-1edf2586105f.jpeg?w=800",
    "https://a0.muscache.com/im/pictures/miso/Hosting-52250898/original/5d9241e9-ab07-444d-b476-f509f74a3df8.jpeg?w=800"
  ],
  layoutStyle: 'airbnb',
  cornerRadius: 'medium',
  showAllPhotosButton: true,
  autoFetch: true
});

export default function RoomGalleryEditor({ sectionId }: RoomGalleryEditorProps) {
  const { sections, updateSectionSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localConfig, setLocalConfig] = useState<RoomGalleryConfig>(getDefaultConfig());

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

  const handleChange = (field: keyof RoomGalleryConfig, value: any) => {
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

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...localConfig.images];
    newImages[index] = value;
    handleChange('images', newImages);
  };

  const addImage = () => {
    if (localConfig.images.length < 10) {
      handleChange('images', [...localConfig.images, '']);
    }
  };

  const removeImage = (index: number) => {
    const newImages = localConfig.images.filter((_, i) => i !== index);
    handleChange('images', newImages);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4" />
          <span className="font-medium text-sm">Room Gallery</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-b">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show gallery</label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* Auto-fetch from Room */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-fetch from room</label>
              <input
                type="checkbox"
                checked={localConfig.autoFetch}
                onChange={(e) => handleChange('autoFetch', e.target.checked)}
                className="rounded"
              />
            </div>
            {localConfig.autoFetch && (
              <>
                <input
                  type="number"
                  value={localConfig.roomId || ''}
                  onChange={(e) => handleChange('roomId', parseInt(e.target.value) || undefined)}
                  placeholder="Room ID (optional)"
                  className="w-full px-3 py-1.5 text-sm border rounded-md"
                />
                <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                  {localConfig.roomId 
                    ? `Using images from Room #${localConfig.roomId}`
                    : 'Using images from first active room'}
                </div>
              </>
            )}
          </div>

          {/* Layout Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Layout style</label>
            <select
              value={localConfig.layoutStyle}
              onChange={(e) => handleChange('layoutStyle', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            >
              <option value="airbnb">Airbnb (1 large + 4 small)</option>
              <option value="grid">Grid (all equal)</option>
              <option value="carousel">Carousel</option>
            </select>
          </div>

          {/* Corner Radius */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Corner radius</label>
            <select
              value={localConfig.cornerRadius}
              onChange={(e) => handleChange('cornerRadius', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            >
              <option value="none">None</option>
              <option value="small">Small (4px)</option>
              <option value="medium">Medium (12px)</option>
              <option value="large">Large (16px)</option>
            </select>
          </div>

          {/* Show All Photos Button */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show "All photos" button</label>
            <input
              type="checkbox"
              checked={localConfig.showAllPhotosButton}
              onChange={(e) => handleChange('showAllPhotosButton', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* Images */}
          {!localConfig.autoFetch && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Images</label>
                <button
                  onClick={addImage}
                  className="text-xs text-blue-600 hover:text-blue-700"
                  disabled={localConfig.images.length >= 10}
                >
                  Add image
                </button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {localConfig.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder={`Image ${index + 1} URL`}
                        className="w-full px-2 py-1 text-xs border rounded"
                      />
                      {image && (
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                    {localConfig.images.length > 1 && (
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}