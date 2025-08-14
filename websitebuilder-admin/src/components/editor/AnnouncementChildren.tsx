'use client';

import React from 'react';
import { Plus, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useStructuralComponents } from '@/hooks/useStructuralComponents';
import { useEditorStore } from '@/stores/useEditorStore';
import { Section } from '@/types/editor.types';

interface AnnouncementChildrenProps {
  section: Section;
  groupId: string;
}

export function AnnouncementChildren({ section, groupId }: AnnouncementChildrenProps) {
  const { config: structuralComponents, updateAnnouncementBarConfigLocal } = useStructuralComponents();
  const { selectSection, toggleConfigPanel } = useEditorStore();
  
  // Get announcements from structural components config
  const announcementConfig = structuralComponents?.announcementBar || {};
  const announcements = announcementConfig.announcements || [];

  const handleAddAnnouncement = () => {
    const newAnnouncement = {
      id: `announcement-${Date.now()}`,
      text: 'New Announcement',
      link: '',
      icon: '',
      customIcon: '',
      visible: true
    };
    
    const updatedConfig = {
      ...announcementConfig,
      announcements: [...announcements, newAnnouncement]
    };
    
    updateAnnouncementBarConfigLocal(updatedConfig);
  };

  const handleSelectAnnouncement = (announcementId: string) => {
    // Select the announcement item
    selectSection(announcementId);
    toggleConfigPanel(true);
  };

  const handleToggleAnnouncementVisibility = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (announcement) {
      const updatedAnnouncements = announcements.map(a => 
        a.id === announcementId 
          ? { ...a, visible: !a.visible } 
          : a
      );
      
      const updatedConfig = {
        ...announcementConfig,
        announcements: updatedAnnouncements
      };
      
      updateAnnouncementBarConfigLocal(updatedConfig);
    }
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== announcementId);
    
    const updatedConfig = {
      ...announcementConfig,
      announcements: updatedAnnouncements
    };
    
    updateAnnouncementBarConfigLocal(updatedConfig);
  };

  return (
    <div className="pl-8">
      {/* Add Announcement Button */}
      <button
        onClick={handleAddAnnouncement}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
      >
        <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Plus className="w-3 h-3" />
        </div>
        <span>Agregar Announcement</span>
      </button>

      {/* List of Announcements */}
      {announcements.map((announcement, index) => (
        <div
          key={announcement.id}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 
                     transition-colors group cursor-pointer"
          onClick={() => handleSelectAnnouncement(announcement.id)}
        >
          {/* Icon */}
          <RefreshCw className="w-3 h-3 text-gray-400" />
          
          {/* Title */}
          <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
            Announcement - {announcement.text || 'Sin texto'}
          </span>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAnnouncementVisibility(announcement.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {announcement.visible !== false ? (
                <Eye className="w-3 h-3 text-gray-500" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAnnouncement(announcement.id);
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}