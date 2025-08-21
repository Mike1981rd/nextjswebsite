'use client';

import React, { useState, useEffect } from 'react';
import { Info, ChevronRight } from 'lucide-react';

interface RoomThingsConfig {
  enabled: boolean;
  title: string;
  houseRules: string[];
  safetyProperty: string[];
  cancellationPolicy: string[];
  showMoreButton: boolean;
}

interface PreviewRoomThingsProps {
  config: RoomThingsConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomThings({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomThingsProps) {
  
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  useEffect(() => {
    if (deviceView !== undefined) {
      setIsMobile(deviceView === 'mobile');
      return;
    }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceView]);

  if (!config.enabled) {
    return null;
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: 'house-rules',
      title: 'House rules',
      items: config.houseRules,
      preview: config.houseRules.slice(0, 3)
    },
    {
      id: 'safety',
      title: 'Safety & property',
      items: config.safetyProperty,
      preview: config.safetyProperty.slice(0, 3)
    },
    {
      id: 'cancellation',
      title: 'Cancellation policy',
      items: config.cancellationPolicy,
      preview: config.cancellationPolicy.slice(0, 3)
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      <h2 className="text-xl font-semibold mb-6">
        {config.title || 'Things to know'}
      </h2>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
        {sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <h3 className="font-semibold">{section.title}</h3>
            
            <ul className="space-y-2">
              {(expandedSections.includes(section.id) ? section.items : section.preview).map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>

            {config.showMoreButton && section.items.length > 3 && (
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-1 text-sm font-semibold underline hover:no-underline"
              >
                {expandedSections.includes(section.id) ? 'Show less' : 'Show more'}
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-90' : ''
                }`} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Additional info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-gray-500 mt-0.5" />
          <p className="text-sm text-gray-600">
            Our community is committed to reliability. Hosts are required to disclose known cameras, 
            and are never permitted in private spaces like bathrooms or sleeping areas.
          </p>
        </div>
      </div>
    </div>
  );
}