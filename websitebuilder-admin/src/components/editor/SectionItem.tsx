'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Link2Off, FileText, Layout, ShoppingCart, Search, Megaphone, Trash2 } from 'lucide-react';
import { Section, SectionType } from '@/types/editor.types';
import { useEditorStore } from '@/stores/useEditorStore';

interface SectionItemProps {
  section: Section;
  groupId: 'headerGroup' | 'asideGroup' | 'template' | 'footerGroup';
  isDragging?: boolean;
}

// Map section types to icons
const sectionIcons: Record<string, React.ReactNode> = {
  [SectionType.ANNOUNCEMENT_BAR]: <FileText className="w-4 h-4" />,
  [SectionType.HEADER]: <FileText className="w-4 h-4" />,
  [SectionType.IMAGE_BANNER]: <FileText className="w-4 h-4" />,
  [SectionType.CART_DRAWER]: <FileText className="w-4 h-4" />,
  [SectionType.SEARCH_DRAWER]: <Search className="w-4 h-4" />,
  [SectionType.FOOTER]: <FileText className="w-4 h-4" />,
  // Add more mappings as needed
  default: <FileText className="w-4 h-4" />
};

export function SectionItem({ section, groupId, isDragging = false }: SectionItemProps) {
  const [showActions, setShowActions] = useState(false);
  const { 
    selectedSectionId, 
    selectSection, 
    toggleSectionVisibility, 
    removeSection 
  } = useEditorStore();
  
  const isSelected = selectedSectionId === section.id;
  
  // Structural components cannot be deleted
  const isStructuralComponent = [
    SectionType.HEADER,
    SectionType.ANNOUNCEMENT_BAR,
    SectionType.FOOTER,
    SectionType.CART_DRAWER
  ].includes(section.type);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isStructuralComponent && window.confirm(`¿Eliminar "${section.name}"?`)) {
      removeSection(groupId, section.id);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSectionVisibility(groupId, section.id);
  };

  const handleSelect = () => {
    selectSection(section.id);
  };

  const icon = sectionIcons[section.type] || sectionIcons.default;

  return (
    <div
      className={`
        group relative flex items-center px-4 py-2 cursor-pointer transition-all
        ${isSelected 
          ? 'bg-blue-100 border-l-2 border-blue-500' 
          : 'hover:bg-gray-100 border-l-2 border-transparent'
        }
        ${isDragging ? 'opacity-50' : ''}
        ${!section.visible ? 'opacity-50' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleSelect}
    >
      {/* Chevron/Arrow */}
      <div className="mr-2">
        <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 6 10">
          <path d="M1 1l4 4-4 4" />
        </svg>
      </div>

      {/* Icon */}
      <div className="mr-2 text-gray-500">
        {icon}
      </div>

      {/* Section Name */}
      <span className={`flex-1 text-sm ${isSelected ? 'font-medium text-blue-600' : 'text-gray-700'}`}>
        {section.name}
      </span>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-1">
          {/* Visibility Toggle */}
          <button
            onClick={handleToggleVisibility}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
          >
            {section.visible ? (
              <Eye className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
          
          {/* Delete Button - Only for non-structural components */}
          {!isStructuralComponent && (
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Eliminar sección"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}