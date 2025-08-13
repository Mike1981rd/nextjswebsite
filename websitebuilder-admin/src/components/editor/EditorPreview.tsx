'use client';

import React from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { Section, SectionType } from '@/types/editor.types';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useColorSchemes } from '@/hooks/useColorSchemes';
import { useStructuralComponents } from '@/hooks/useStructuralComponents';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';

type DeviceView = 'desktop' | 'tablet' | 'mobile';

export function EditorPreview() {
  const { sections, selectedSectionId, selectSection, hoveredSectionId, setHoveredSection } = useEditorStore();
  const [deviceView, setDeviceView] = React.useState<DeviceView>('desktop');
  const { colorSchemes } = useColorSchemes();
  const { config: structuralComponents } = useStructuralComponents();
  const { menus } = useNavigationMenus();

  // Separate sections by group for proper layout
  const headerSections = sections.headerGroup.filter(s => s.visible);
  const templateSections = sections.template.filter(s => s.visible);
  const footerSections = sections.footerGroup.filter(s => s.visible);
  const asideSections = sections.asideGroup.filter(s => s.visible);

  const getPreviewWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  const renderSectionPreview = (section: Section) => {
    const isSelected = selectedSectionId === section.id;
    const isHovered = hoveredSectionId === section.id;

    switch (section.type) {
      case SectionType.ANNOUNCEMENT_BAR:
        return (
          <div 
            style={{ 
              backgroundColor: section.settings.backgroundColor || '#000000',
              color: section.settings.textColor || '#ffffff'
            }}
            className="py-2 px-4 text-center text-sm"
          >
            {section.settings.text || 'Announcement text here'}
          </div>
        );

      case SectionType.HEADER:
        // Get the selected color scheme from section settings (for live preview) or from backend
        const headerConfig = section.settings as any || structuralComponents?.header;
        const selectedSchemeIndex = headerConfig?.colorScheme ? parseInt(headerConfig.colorScheme) - 1 : 0;
        
        // Debug logging
        console.log('Header colorScheme value:', headerConfig?.colorScheme);
        console.log('Selected scheme index:', selectedSchemeIndex);
        console.log('Available schemes:', colorSchemes?.schemes?.length);
        console.log('All schemes:', colorSchemes?.schemes);
        
        const activeScheme = colorSchemes?.schemes?.[selectedSchemeIndex];
        
        if (!activeScheme && colorSchemes?.schemes) {
          console.warn(`Scheme at index ${selectedSchemeIndex} not found. Using first available scheme.`);
        }
        
        // Fallback to first scheme if selected one doesn't exist
        const fallbackScheme = colorSchemes?.schemes?.[0];
        const schemeToUse = activeScheme || fallbackScheme;
        
        // Get the selected menu items
        const selectedMenuId = headerConfig?.menuId;
        const selectedMenu = menus?.find(m => m.id === selectedMenuId);
        const menuItems = selectedMenu?.items || [];
        
        // Apply colors from the selected scheme
        const headerStyles = schemeToUse ? {
          backgroundColor: schemeToUse.background,
          borderColor: schemeToUse.border,
          color: schemeToUse.text,
          height: headerConfig?.height ? `${headerConfig.height}px` : '80px'
        } : {
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          color: '#000000',
          height: headerConfig?.height ? `${headerConfig.height}px` : '80px'
        };

        const linkStyles = schemeToUse ? {
          color: schemeToUse.text,
        } : {};

        const linkHoverStyles = schemeToUse ? {
          color: schemeToUse.link,
        } : {};

        return (
          <div 
            className="border-b transition-all duration-300"
            style={headerStyles}
          >
            <div className="px-4 h-full flex items-center justify-between">
              <div className="text-xl font-bold" style={{ color: schemeToUse?.text || '#000000' }}>LOGO</div>
              <nav className="flex gap-6">
                {menuItems.length > 0 ? (
                  menuItems.map((item: any) => (
                    <div 
                      key={item.label}
                      className="relative group"
                    >
                      <a 
                        href="#" 
                        className="transition-colors hover:opacity-80 flex items-center gap-1"
                        style={linkStyles}
                        onMouseEnter={(e) => {
                          if (schemeToUse) {
                            e.currentTarget.style.color = schemeToUse.link;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (schemeToUse) {
                            e.currentTarget.style.color = schemeToUse.text;
                          }
                        }}
                      >
                        {item.label}
                        {item.subItems && item.subItems.length > 0 && (
                          <svg 
                            className="w-3 h-3" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </a>
                      
                      {/* Dropdown menu for subitems */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                          style={{
                            backgroundColor: schemeToUse?.background || '#ffffff',
                            borderColor: schemeToUse?.border || '#e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="border rounded-md overflow-hidden">
                            {item.subItems.map((subItem: any) => (
                              <a
                                key={subItem.label}
                                href="#"
                                className="block px-4 py-2 text-sm hover:opacity-80 transition-colors"
                                style={{
                                  color: schemeToUse?.text,
                                  backgroundColor: schemeToUse?.background,
                                }}
                                onMouseEnter={(e) => {
                                  if (schemeToUse) {
                                    e.currentTarget.style.backgroundColor = schemeToUse?.foreground || '#f3f4f6';
                                    e.currentTarget.style.color = schemeToUse.link;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (schemeToUse) {
                                    e.currentTarget.style.backgroundColor = schemeToUse?.background;
                                    e.currentTarget.style.color = schemeToUse.text;
                                  }
                                }}
                              >
                                {subItem.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-sm opacity-50" style={{ color: schemeToUse?.text }}>
                    {selectedMenuId ? 'Loading menu...' : 'No menu selected'}
                  </span>
                )}
              </nav>
              <div className="flex gap-4 items-center">
                {/* Search Icon */}
                <svg className="w-5 h-5" style={{ color: schemeToUse?.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Cart Icon */}
                <svg className="w-5 h-5" style={{ color: schemeToUse?.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
        );

      case SectionType.IMAGE_BANNER:
        return (
          <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">
                {section.settings.title || 'Banner Title'}
              </h1>
              <p className="text-lg mb-4">
                {section.settings.subtitle || 'Banner subtitle'}
              </p>
              {section.settings.buttonText && (
                <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium">
                  {section.settings.buttonText}
                </button>
              )}
            </div>
          </div>
        );

      case SectionType.IMAGE_WITH_TEXT:
        const imageLeft = section.settings.imagePosition === 'left';
        return (
          <div className="py-12 px-4">
            <div className={`flex gap-8 items-center ${imageLeft ? '' : 'flex-row-reverse'}`}>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">
                  {section.settings.title || 'Section Title'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {section.settings.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                </p>
              </div>
            </div>
          </div>
        );

      case SectionType.FOOTER:
        return (
          <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Company</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>About</li>
                    <li>Careers</li>
                    <li>Press</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Products</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Features</li>
                    <li>Pricing</li>
                    <li>Security</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Help Center</li>
                    <li>Contact</li>
                    <li>Status</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Cookie Policy</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                © 2025 Your Company. All rights reserved.
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">{section.name}</div>
              <div className="text-sm">Preview coming soon...</div>
            </div>
          </div>
        );
    }
  };

  const renderSection = (section: Section) => (
    <div
      key={section.id}
      className={`
        relative group cursor-pointer transition-all
        ${selectedSectionId === section.id ? 'outline outline-2 outline-blue-500 outline-offset-2' : ''}
        ${hoveredSectionId === section.id && selectedSectionId !== section.id ? 'outline outline-2 outline-blue-300 outline-offset-2' : ''}
      `}
      onClick={() => selectSection(section.id)}
      onMouseEnter={() => setHoveredSection(section.id)}
      onMouseLeave={() => setHoveredSection(null)}
    >
      {renderSectionPreview(section)}
      
      {/* Section Label on Hover */}
      {(hoveredSectionId === section.id || selectedSectionId === section.id) && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {section.name}
        </div>
      )}
    </div>
  );

  const hasContent = headerSections.length > 0 || templateSections.length > 0 || footerSections.length > 0;

  return (
    <div className="flex-1 bg-white h-full flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto flex justify-center bg-gray-100">
        <div className={`bg-white ${getPreviewWidth()} min-h-full shadow-lg flex flex-col`}>
          {!hasContent ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
              <div className="text-center">
                <div className="text-lg mb-2">No hay secciones visibles</div>
                <div className="text-sm">Las secciones estructurales están configuradas pero ocultas</div>
              </div>
            </div>
          ) : (
            <>
              {/* Header sections at the top */}
              <div className="flex-shrink-0">
                {headerSections.map(renderSection)}
              </div>

              {/* Main content area - grows to fill space */}
              <div className="flex-1">
                {templateSections.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center text-gray-400 bg-gray-50">
                    <div className="text-center">
                      <div className="text-lg mb-2">Área de contenido vacía</div>
                      <div className="text-sm">Agrega secciones de contenido desde la barra lateral</div>
                    </div>
                  </div>
                ) : (
                  templateSections.map(renderSection)
                )}
              </div>

              {/* Footer sections at the bottom */}
              <div className="flex-shrink-0 mt-auto">
                {footerSections.map(renderSection)}
              </div>
            </>
          )}

          {/* Aside sections like cart drawer would be rendered as overlays */}
          {asideSections.map(section => (
            <div key={section.id} className="hidden">
              {/* Cart drawer and search drawer are hidden by default, shown on interaction */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}