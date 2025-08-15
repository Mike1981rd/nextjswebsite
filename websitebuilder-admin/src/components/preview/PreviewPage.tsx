'use client';

import React, { useEffect, useState } from 'react';
import { PageType } from '@/types/editor.types';
import PreviewHeader from './PreviewHeader';
import PreviewFooter from './PreviewFooter';
import PreviewContent from './PreviewContent';
import PreviewAnnouncementBar from './PreviewAnnouncementBar';
import PreviewImageBanner from './PreviewImageBanner';

interface PreviewPageProps {
  pageType: PageType;
  handle: string;
}

interface StructuralComponents {
  header?: any;
  footer?: any;
  announcementBar?: any;
  imageBanner?: any;
  cartDrawer?: any;
}

export default function PreviewPage({ pageType, handle }: PreviewPageProps) {
  const [structuralComponents, setStructuralComponents] = useState<StructuralComponents>({});
  const [globalTheme, setGlobalTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [editorDeviceView, setEditorDeviceView] = useState<'desktop' | 'mobile' | undefined>(undefined);

  useEffect(() => {
    // Get company ID from localStorage or use default
    // In production, this would come from the domain or subdomain
    const storedCompanyId = localStorage.getItem('companyId');
    const id = storedCompanyId ? parseInt(storedCompanyId) : 1; // Default to company 1 for now
    console.log('Setting company ID from localStorage:', storedCompanyId, '-> using:', id);
    setCompanyId(id);
    
    // Get editor device view for synchronization
    const storedDeviceView = localStorage.getItem('editorDeviceView');
    // Only honor explicit mobile override; desktop should use real viewport
    if (storedDeviceView === 'mobile') {
      setEditorDeviceView('mobile');
    } else {
      setEditorDeviceView(undefined);
    }
    
    // Listen for storage changes to sync with editor
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'editorDeviceView') {
        // Only apply override when mobile; otherwise remove override
        if (e.newValue === 'mobile') {
          setEditorDeviceView('mobile');
        } else {
          setEditorDeviceView(undefined);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const loadConfiguration = async () => {
      console.log('Loading configuration for company ID:', companyId);
      if (!companyId) {
        console.log('No company ID, skipping load');
        return;
      }

      try {
        // Load structural components (header, footer, etc.)
        // Use the published endpoint which allows anonymous access
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api';
        const structuralUrl = `${apiUrl}/structural-components/company/${companyId}/published`;
        console.log('Fetching structural components from:', structuralUrl);
        
        const structuralResponse = await fetch(structuralUrl);
        console.log('Structural response status:', structuralResponse.status);
        
        if (structuralResponse.ok) {
          const data = await structuralResponse.json();
          console.log('Raw structural data:', data);
          
          // Parse the JSON strings from the API response
          const parsedComponents = {
            header: data.headerConfig ? JSON.parse(data.headerConfig) : null,
            footer: data.footerConfig ? JSON.parse(data.footerConfig) : null,
            announcementBar: data.announcementBarConfig ? JSON.parse(data.announcementBarConfig) : null,
            imageBanner: data.imageBannerConfig ? JSON.parse(data.imageBannerConfig) : null,
            cartDrawer: data.cartDrawerConfig ? JSON.parse(data.cartDrawerConfig) : null,
          };
          console.log('Parsed structural components:', parsedComponents);
          setStructuralComponents(parsedComponents);
        } else {
          console.error('Failed to load structural components:', structuralResponse.statusText);
        }

        // Load global theme configuration (use published endpoint for anonymous access)
        const themeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api'}/global-theme-config/company/${companyId}/published`
        );
        
        if (themeResponse.ok) {
          const data = await themeResponse.json();
          setGlobalTheme(data);
        }
      } catch (error) {
        console.error('Error loading preview configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, [companyId]);

  if (loading || !companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  // Apply global theme styles
  const themeStyles = globalTheme ? {
    '--page-width': globalTheme.appearance?.pageWidth || '1440px',
    '--content-padding': globalTheme.appearance?.contentPadding || '20px',
    '--border-radius': globalTheme.appearance?.borderRadius || '8px',
  } as React.CSSProperties : {};

  console.log('Rendering preview with:', {
    loading,
    hasHeader: !!structuralComponents.header,
    headerConfig: structuralComponents.header,
    hasTheme: !!globalTheme
  });

  return (
    <div className="min-h-screen" style={{...themeStyles, overflowY: 'auto', height: '100vh'}}>
      {/* Announcement Bar - if configured and should show on this page */}
      {structuralComponents.announcementBar && (
        <PreviewAnnouncementBar 
          config={structuralComponents.announcementBar} 
          theme={globalTheme}
          pageType={pageType}
          deviceView={editorDeviceView}
        />
      )}

      {/* Header - if configured */}
      {structuralComponents.header ? (
        <PreviewHeader 
          config={structuralComponents.header} 
          theme={globalTheme}
          deviceView={editorDeviceView}
        />
      ) : (
        console.log('No header config available') || null
      )}

      {/* Image Banner - if configured */}
      {structuralComponents.imageBanner && (
        <PreviewImageBanner 
          config={structuralComponents.imageBanner}
          isEditor={false}
          deviceView={editorDeviceView}
        />
      )}

      {/* Page Content */}
      <main className="flex-1">
        <PreviewContent 
          pageType={pageType} 
          handle={handle}
          theme={globalTheme}
          companyId={companyId || undefined}
        />
      </main>

      {/* Footer - if configured */}
      {structuralComponents.footer && (
        <PreviewFooter 
          config={structuralComponents.footer} 
          theme={globalTheme}
          deviceView={editorDeviceView}
          isEditor={false}
        />
      )}

      {/* Cart Drawer - if configured */}
      {structuralComponents.cartDrawer && (
        <div id="cart-drawer">
          {/* Will be implemented when CartDrawer editor is ready */}
        </div>
      )}
    </div>
  );
}