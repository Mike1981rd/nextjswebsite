'use client';

import React from 'react';
import { EditorSidebarWithDnD } from './EditorSidebarWithDnD';
import { EditorPreview } from './EditorPreview';

interface EditorLayoutProps {
  deviceView?: 'desktop' | 'mobile';
}

export function EditorLayout({ deviceView = 'desktop' }: EditorLayoutProps) {
  return (
    <div className="flex h-full relative">
      {/* Sidebar with Drag & Drop - Fixed */}
      <div className="h-full overflow-hidden">
        <EditorSidebarWithDnD />
      </div>
      
      {/* Preview Area - Scrollable */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorPreview deviceView={deviceView} />
      </div>
    </div>
  );
}