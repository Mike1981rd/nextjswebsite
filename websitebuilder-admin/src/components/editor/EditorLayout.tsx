'use client';

import React from 'react';
import { EditorSidebar } from './EditorSidebar';
import { EditorPreview } from './EditorPreview';

interface EditorLayoutProps {
  deviceView?: 'desktop' | 'mobile';
}

export function EditorLayout({ deviceView = 'desktop' }: EditorLayoutProps) {
  return (
    <div className="flex h-full relative">
      {/* Sidebar - Fixed */}
      <div className="h-full overflow-hidden">
        <EditorSidebar />
      </div>
      
      {/* Preview Area - Scrollable */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorPreview deviceView={deviceView} />
      </div>
    </div>
  );
}