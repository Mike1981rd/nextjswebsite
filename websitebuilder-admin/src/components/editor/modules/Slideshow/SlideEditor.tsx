/**
 * @file SlideEditor.tsx
 * @max-lines 300
 * @module Slideshow
 * Editor for individual slide configuration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { SlideshowConfig, SlideConfig } from './types';

interface SlideEditorProps {
  sectionId: string;
  slideId: string;
}

export default function SlideEditor({ sectionId, slideId }: SlideEditorProps) {
  const { sections, updateSectionSettings, selectSection } = useEditorStore();
  
  // Find section and slide
  const section = Object.values(sections).flat().find(s => s.id === sectionId);
  const config = section?.settings as SlideshowConfig;
  const slides = config?.slides || [];
  const currentSlide = slides.find((s: SlideConfig) => s.id === slideId);
  
  // Local state
  const [localSlide, setLocalSlide] = useState<SlideConfig | null>(currentSlide || null);
  
  // Sync with props
  useEffect(() => {
    const updatedSection = Object.values(sections).flat().find(s => s.id === sectionId);
    const updatedConfig = updatedSection?.settings as SlideshowConfig;
    const updatedSlide = updatedConfig?.slides?.find((s: SlideConfig) => s.id === slideId);
    
    if (updatedSlide && JSON.stringify(updatedSlide) !== JSON.stringify(localSlide)) {
      setLocalSlide(updatedSlide);
    }
  }, [sectionId, slideId, sections]);
  
  if (!localSlide) {
    return (
      <div className="w-[320px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-500">Slide not found</p>
      </div>
    );
  }
  
  const handleBack = () => {
    selectSection(null);  // Go back to main sidebar, not parent config
  };
  
  const handleChange = (field: keyof SlideConfig, value: any) => {
    const updatedSlide = { ...localSlide, [field]: value };
    setLocalSlide(updatedSlide);
    
    // Update in store
    if (section && config) {
      const updatedSlides = slides.map((s: SlideConfig) => 
        s.id === slideId ? updatedSlide : s
      );
      
      const groupId = Object.keys(sections).find(key => 
        sections[key as keyof typeof sections].includes(section)
      );
      
      if (groupId) {
        updateSectionSettings(groupId, section.id, {
          ...config,
          slides: updatedSlides
        });
      }
    }
  };
  
  const handleImageUpload = (field: 'desktopImage' | 'mobileImage') => {
    // TODO: Implement image upload
    console.log('Image upload for:', field);
  };
  
  const handleRemoveImage = (field: 'desktopImage' | 'mobileImage') => {
    handleChange(field, '');
  };
  
  return (
    <div className="w-[320px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-medium">Edit Slide</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Desktop Image */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Desktop image</label>
          <div className="mt-1">
            {localSlide.desktopImage ? (
              <div className="relative group">
                <img 
                  src={localSlide.desktopImage} 
                  alt="Desktop" 
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveImage('desktopImage')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleImageUpload('desktopImage')}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload image</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Image */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Mobile image</label>
          <div className="mt-1">
            {localSlide.mobileImage ? (
              <div className="relative group">
                <img 
                  src={localSlide.mobileImage} 
                  alt="Mobile" 
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveImage('mobileImage')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleImageUpload('mobileImage')}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload image</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Heading */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Heading</label>
          <input
            type="text"
            value={localSlide.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            className="w-full mt-1 px-2 py-1.5 text-sm border rounded"
            placeholder="Enter heading"
          />
        </div>
        
        {/* Subheading */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Subheading</label>
          <textarea
            value={localSlide.subheading}
            onChange={(e) => handleChange('subheading', e.target.value)}
            className="w-full mt-1 px-2 py-1.5 text-sm border rounded resize-none"
            rows={2}
            placeholder="Enter subheading"
          />
        </div>
        
        {/* Content Alignment */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Content alignment</label>
          <div className="flex gap-1 mt-1">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => handleChange('contentAlignment', align)}
                className={`flex-1 px-2 py-1 text-xs rounded capitalize ${
                  localSlide.contentAlignment === align
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
        
        {/* Button Settings */}
        <div className="space-y-3 pt-2 border-t">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Button Settings</h4>
          
          {/* Button Text */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">Button text</label>
            <input
              type="text"
              value={localSlide.buttonText}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              className="w-full mt-1 px-2 py-1.5 text-sm border rounded"
              placeholder="Shop now"
            />
          </div>
          
          {/* Button Link */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">Button link</label>
            <input
              type="text"
              value={localSlide.buttonLink}
              onChange={(e) => handleChange('buttonLink', e.target.value)}
              className="w-full mt-1 px-2 py-1.5 text-sm border rounded"
              placeholder="/collections/all"
            />
          </div>
          
          {/* Button Style */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">Button style</label>
            <select 
              className="w-full mt-1 px-2 py-1.5 text-sm border rounded"
              value={localSlide.buttonStyle}
              onChange={(e) => handleChange('buttonStyle', e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-gray-600 dark:text-gray-400">Visible</span>
          <button
            onClick={() => handleChange('visible', !localSlide.visible)}
            className={`w-10 h-5 rounded-full transition-colors ${
              localSlide.visible ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              localSlide.visible ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}