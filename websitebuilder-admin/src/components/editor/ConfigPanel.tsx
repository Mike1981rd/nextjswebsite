'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Section, SectionType } from '@/types/editor.types';
import { useEditorStore } from '@/stores/useEditorStore';
import { HeaderEditor } from './HeaderEditor';
import AnnouncementBarEditor from './AnnouncementBarEditor';
import AnnouncementItemEditor from './AnnouncementItemEditor';
import FooterEditor from './FooterEditor';
import FooterMenuEditor from './FooterMenuEditor';
import FooterLogoWithTextEditor from './FooterLogoWithTextEditor';
import FooterSubscribeEditor from './FooterSubscribeEditor';
import FooterTextEditor from './FooterTextEditor';
import FooterSocialMediaEditor from './FooterSocialMediaEditor';
import FooterImageEditor from './FooterImageEditor';
import { useStructuralComponents } from '@/hooks/useStructuralComponents';
import { HeaderConfig } from '@/types/components/header';
import { FooterBlockType } from './modules/Footer/FooterTypes';

interface ConfigPanelProps {
  section: Section;
}

export function ConfigPanel({ section }: ConfigPanelProps) {
  const { selectSection, updateSectionSettings } = useEditorStore();
  const { headerConfig, updateHeaderConfigLocal, config: structuralComponents } = useStructuralComponents();
  const [settings, setSettings] = useState(section.settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  
  // Check if this is an announcement item (child)
  const isAnnouncementItem = section.id.startsWith('announcement-');
  
  // Check if this is a footer block (child)
  const isFooterBlock = section.id.startsWith('footer-block-');
  
  // Get footer block type if it's a footer block
  const getFooterBlockType = (): FooterBlockType | null => {
    if (!isFooterBlock) return null;
    const footerConfig = structuralComponents?.footer;
    const block = footerConfig?.blocks?.find((b: any) => b.id === section.id);
    return block?.type || null;
  };

  useEffect(() => {
    setSettings(section.settings);
    setHasChanges(false);
  }, [section, JSON.stringify(section.settings)]); // Force update when settings change (for undo)

  const handleBack = () => {
    selectSection(null);
  };

  const handleSave = async () => {
    // Special handling for Header - just update the local state
    if (section.type === SectionType.HEADER) {
      // The actual save happens through the global save button
      // which calls publishStructural()
      // Don't reset hasChanges here because it needs to stay true
      // until the global save button is clicked
      return;
    }

    // Regular sections
    const { sections } = useEditorStore.getState();
    let groupId: 'headerGroup' | 'asideGroup' | 'template' | 'footerGroup' | null = null;
    
    for (const [key, group] of Object.entries(sections)) {
      if (group.some(s => s.id === section.id)) {
        groupId = key as 'headerGroup' | 'asideGroup' | 'template' | 'footerGroup';
        break;
      }
    }
    
    if (groupId) {
      updateSectionSettings(groupId, section.id, settings);
      setHasChanges(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Return early for announcement items AFTER all hooks
  if (isAnnouncementItem) {
    return <AnnouncementItemEditor announcementId={section.id} />;
  }
  
  // Return early for footer blocks AFTER all hooks
  if (isFooterBlock) {
    const blockType = getFooterBlockType();
    
    // Handle different footer block types
    if (blockType === FooterBlockType.MENU) {
      return <FooterMenuEditor blockId={section.id} />;
    }
    
    if (blockType === FooterBlockType.LOGO_WITH_TEXT) {
      return <FooterLogoWithTextEditor blockId={section.id} />;
    }
    
    if (blockType === FooterBlockType.SUBSCRIBE) {
      return <FooterSubscribeEditor blockId={section.id} />;
    }
    
    if (blockType === FooterBlockType.TEXT) {
      return <FooterTextEditor blockId={section.id} />;
    }
    
    if (blockType === FooterBlockType.SOCIAL_MEDIA) {
      return <FooterSocialMediaEditor blockId={section.id} />;
    }
    
    if (blockType === FooterBlockType.IMAGE) {
      return <FooterImageEditor blockId={section.id} />;
    }
    
    // For other footer block types, show placeholder
    return (
      <div className="w-[320px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configuration for {blockType} block coming soon...
          </p>
        </div>
      </div>
    );
  }

  const renderConfigFields = () => {
    switch (section.type) {
      case SectionType.HEADER:
        return (
          <HeaderEditor
            value={settings as HeaderConfig}
            onChange={(newConfig) => {
              // Check if config actually changed
              const currentConfigStr = JSON.stringify(headerConfig || settings);
              const newConfigStr = JSON.stringify(newConfig);
              
              if (currentConfigStr === newConfigStr) {
                return; // No actual change, skip update
              }
              
              console.log('HeaderEditor onChange - new config:', newConfig);
              console.log('Logo config:', newConfig.logo);
              
              // Save history before making changes
              const store = useEditorStore.getState();
              store.saveHistory();
              
              setSettings(newConfig);
              setHasChanges(true);
              // Update the local config for live preview
              updateHeaderConfigLocal(newConfig);
              // Also update the store for consistency
              const { sections } = store;
              for (const [key, group] of Object.entries(sections)) {
                const sectionIndex = group.findIndex(s => s.id === section.id);
                if (sectionIndex !== -1) {
                  updateSectionSettings(key, section.id, newConfig);
                  console.log(`Updated section ${section.id} in group ${key} with logo:`, newConfig.logo);
                  break;
                }
              }
            }}
          />
        );

      case SectionType.IMAGE_BANNER:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={settings.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={settings.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={settings.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={settings.buttonUrl || ''}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          </>
        );

      case SectionType.ANNOUNCEMENT_BAR:
        return <AnnouncementBarEditor />;

      case SectionType.FOOTER:
        return <FooterEditor />;

      case SectionType.IMAGE_WITH_TEXT:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={settings.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={settings.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image Position
              </label>
              <select
                value={settings.imagePosition || 'left'}
                onChange={(e) => handleChange('imagePosition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      default:
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Configuration for {section.name} coming soon...
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {section.name}
          </h2>
        </div>
        
        {hasChanges && section.type !== SectionType.HEADER && (
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Configuration Fields */}
      <div className="p-4">
        {renderConfigFields()}
      </div>
    </div>
  );
}