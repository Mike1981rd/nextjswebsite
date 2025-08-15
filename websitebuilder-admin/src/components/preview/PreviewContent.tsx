'use client';

import React, { useEffect, useState } from 'react';
import { PageType, Section } from '@/types/editor.types';

interface PreviewContentProps {
  pageType: PageType;
  handle: string;
  theme: any;
  companyId?: number;
}

export default function PreviewContent({ pageType, handle, theme, companyId }: PreviewContentProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageSections = async () => {
      // Get company ID from localStorage if not provided
      const effectiveCompanyId = companyId || parseInt(localStorage.getItem('companyId') || '1');
      if (!effectiveCompanyId) return;

      try {
        // Try to load page by slug/handle
        const pageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/websitepages/company/${effectiveCompanyId}/slug/${handle}`
        );
        
        if (pageResponse.ok) {
          const page = await pageResponse.json();
          console.log('Loaded page data:', page);
          setPageData(page);
          
          // Parse sections if they exist
          if (page.sections) {
            const parsedSections = typeof page.sections === 'string' 
              ? JSON.parse(page.sections) 
              : page.sections;
            console.log('Parsed sections:', parsedSections);
            console.log('Section types:', parsedSections.map((s: any) => s.type));
            setSections(parsedSections);
          } else {
            console.log('No sections in page data');
          }
        } else {
          console.log('No page found for handle:', handle);
          // Page doesn't exist yet, show empty state
          setSections([]);
        }
        
      } catch (error) {
        console.error('Error loading page sections:', error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    loadPageSections();
  }, [companyId, handle]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Apply theme styles
  const containerStyle = {
    maxWidth: theme?.appearance?.pageWidth || '1440px',
    padding: theme?.appearance?.contentPadding || '20px',
  };

  return (
    <div className="min-h-[60vh]" style={containerStyle}>
      {sections.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Página {pageType}
          </h2>
          <p className="text-gray-500">
            Esta página aún no tiene contenido configurado.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Vuelve al editor para agregar secciones a esta página.
          </p>
        </div>
      ) : (
        <div className="space-y-8 py-8">
          {sections.map((section, index) => (
            <div key={index} className="section">
              {/* Render each section based on its type */}
              {section.type === 'hero' && (
                <div className="text-center py-20 bg-gray-100 rounded">
                  <h1 className="text-4xl font-bold mb-4">{section.content}</h1>
                </div>
              )}
              {section.type === 'product_info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-100 h-96 rounded"></div>
                  <div>
                    <h1 className="text-3xl font-bold mb-4">{section.content}</h1>
                    <p className="text-gray-600 mb-4">
                      Descripción del producto aquí...
                    </p>
                    <button className="bg-black text-white px-6 py-3 rounded">
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              )}
              {/* Add more section types as they are implemented */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}