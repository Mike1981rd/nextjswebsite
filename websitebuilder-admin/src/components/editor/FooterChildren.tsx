/**
 * @file FooterChildren.tsx
 * @max-lines 250
 * Footer blocks management in sidebar - Similar to AnnouncementChildren
 */

'use client';

import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useStructuralComponents } from '@/hooks/useStructuralComponents';
import { useEditorStore } from '@/stores/useEditorStore';
import { Section } from '@/types/editor.types';
import { FooterBlockType } from './modules/Footer/FooterTypes';
import { AddFooterBlockModal } from './AddFooterBlockModal';

interface FooterChildrenProps {
  section: Section;
  groupId: string;
}

const blockTypeLabels: Record<FooterBlockType, string> = {
  [FooterBlockType.LOGO_WITH_TEXT]: 'Logo con texto',
  [FooterBlockType.SUBSCRIBE]: 'Suscripción',
  [FooterBlockType.SOCIAL_MEDIA]: 'Redes sociales',
  [FooterBlockType.MENU]: 'Menú',
  [FooterBlockType.TEXT]: 'Texto',
  [FooterBlockType.IMAGE]: 'Imagen'
};

export function FooterChildren({ section, groupId }: FooterChildrenProps) {
  const { config: structuralComponents, updateFooterConfigLocal } = useStructuralComponents();
  const { selectSection, toggleConfigPanel } = useEditorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get footer blocks from structural components config
  const footerConfig = structuralComponents?.footer || {};
  const blocks = footerConfig.blocks || [];

  const handleAddBlock = (type: FooterBlockType) => {
    const newBlock = {
      id: `footer-block-${Date.now()}`,
      type: type,
      title: blockTypeLabels[type],
      visible: true,
      settings: getDefaultSettings(type)
    };
    
    const updatedConfig = {
      ...footerConfig,
      blocks: [...blocks, newBlock]
    };
    
    updateFooterConfigLocal(updatedConfig);
  };

  const getDefaultSettings = (type: FooterBlockType) => {
    switch (type) {
      case FooterBlockType.TEXT:
        return { content: 'Tu texto aquí' };
      case FooterBlockType.MENU:
        return { links: ['Enlace 1', 'Enlace 2'] };
      case FooterBlockType.SOCIAL_MEDIA:
        return { platforms: [] };
      case FooterBlockType.SUBSCRIBE:
        return { placeholder: 'Correo electrónico' };
      case FooterBlockType.LOGO_WITH_TEXT:
        return { text: 'Descripción de tu empresa' };
      case FooterBlockType.IMAGE:
        return { url: '', alt: '' };
      default:
        return {};
    }
  };

  const handleSelectBlock = (blockId: string) => {
    // Select the block item
    selectSection(blockId);
    toggleConfigPanel(true);
  };

  const handleToggleBlockVisibility = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      const updatedBlocks = blocks.map(b => 
        b.id === blockId 
          ? { ...b, visible: !b.visible } 
          : b
      );
      
      const updatedConfig = {
        ...footerConfig,
        blocks: updatedBlocks
      };
      
      updateFooterConfigLocal(updatedConfig);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(b => b.id !== blockId);
    
    const updatedConfig = {
      ...footerConfig,
      blocks: updatedBlocks
    };
    
    updateFooterConfigLocal(updatedConfig);
  };

  const getBlockIcon = (type: FooterBlockType) => {
    switch(type) {
      case FooterBlockType.TEXT:
        return '📝';
      case FooterBlockType.MENU:
        return '☰';
      case FooterBlockType.SOCIAL_MEDIA:
        return '🔗';
      case FooterBlockType.SUBSCRIBE:
        return '✉️';
      case FooterBlockType.LOGO_WITH_TEXT:
        return '🏢';
      case FooterBlockType.IMAGE:
        return '🖼️';
      default:
        return '📦';
    }
  };

  return (
    <div className="pl-8">
      {/* Add Block Button - Blue like Announcement */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
      >
        <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Plus className="w-3 h-3" />
        </div>
        <span>Agregar bloque</span>
      </button>

      {/* List of Blocks */}
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors select-none hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          onClick={() => handleSelectBlock(block.id)}
        >
          {/* Block icon */}
          <span className="text-sm">{getBlockIcon(block.type)}</span>
          
          {/* Block name */}
          <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">
            {block.title || blockTypeLabels[block.type]}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleBlockVisibility(block.id);
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Mostrar/Ocultar"
            >
              {block.visible !== false ? (
                <Eye className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(block.id);
              }}
              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        </div>
      ))}

      {/* Add Footer Block Modal */}
      <AddFooterBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBlock={handleAddBlock}
      />
    </div>
  );
}