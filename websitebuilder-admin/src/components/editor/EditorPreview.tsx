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
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeDrawerSubmenu, setActiveDrawerSubmenu] = React.useState<string | null>(null);
  const { colorSchemes } = useColorSchemes();
  const { config: structuralComponents } = useStructuralComponents();
  const { menus } = useNavigationMenus();
  
  // Close dropdown when clicking outside (only for click mode)
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if clicking outside of navigation area
      if (!target.closest('nav') && !target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    
    // Define schemeToUse outside switch for drawer access
    let schemeToUse: any = null;
    let headerConfig: any = null;
    let isDrawerLayout = false;
    let menuItems: any[] = [];
    let selectedMenuId: number | undefined = undefined;
    
    // Calculate header-specific values if this is a header section
    if (section.type === SectionType.HEADER) {
      headerConfig = section.settings as any || structuralComponents?.header;
      const selectedSchemeIndex = headerConfig?.colorScheme ? parseInt(headerConfig.colorScheme) - 1 : 0;
      const activeScheme = colorSchemes?.schemes?.[selectedSchemeIndex];
      const fallbackScheme = colorSchemes?.schemes?.[0];
      schemeToUse = activeScheme || fallbackScheme;
      isDrawerLayout = headerConfig?.layout === 'drawer';
      
      // Get menu items
      selectedMenuId = headerConfig?.menuId;
      const selectedMenu = menus?.find(m => m.id === selectedMenuId);
      menuItems = selectedMenu?.items || [];
    }

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
        // Debug logging
        console.log('Header config:', headerConfig);
        console.log('Logo config:', headerConfig?.logo);
        console.log('Desktop URL:', headerConfig?.logo?.desktopUrl);
        console.log('SchemeToUse:', schemeToUse);
        console.log('Text color:', schemeToUse?.text);
        
        // Get menu behavior setting (click or hover)
        const menuOpenOn = headerConfig?.menuOpenOn || 'hover';
        
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

        // Determine the layout structure
        const isLogoLeftMenuCenter = headerConfig?.layout === 'logo-left-menu-center-inline';
        
        return (
          <>
            <div 
              className="border-b transition-all duration-300"
              style={{
                ...headerStyles
              }}
            >
              <div className={`${headerConfig?.width === 'screen' ? 'px-4' : 'container mx-auto px-4'} h-full flex items-center justify-between`}>
              {/* Left section - Hamburger or Logo */}
              <div className="flex items-center">
                {isDrawerLayout ? (
                  // Hamburger menu for drawer layout
                  <button
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    className="p-2 hover:opacity-70 transition-opacity"
                    style={{ color: schemeToUse?.text || '#000000' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                ) : (
                  // Logo for non-drawer layouts
                  <>
                    {headerConfig?.logo?.desktopUrl ? (
                      <img
                        src={headerConfig.logo.desktopUrl}
                        alt={headerConfig.logo.alt || 'Company Logo'}
                        className="self-center"
                        style={{ 
                          height: headerConfig.logo.height || 40,
                          objectFit: 'contain',
                          display: deviceView === 'mobile' ? 'none' : 'block'
                        }}
                        onError={(e) => {
                          console.error('Failed to load logo:', headerConfig.logo.desktopUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div 
                        className={`text-xl font-bold self-center ${deviceView === 'mobile' ? 'hidden sm:block' : ''}`} 
                        style={{ color: schemeToUse?.text || '#000000' }}
                      >
                        Aurora
                      </div>
                    )}
                  </>
                )}
                
                {/* Mobile logo */}
                {deviceView === 'mobile' && headerConfig?.logo?.mobileUrl && (
                  <img
                    src={headerConfig.logo.mobileUrl}
                    alt={headerConfig.logo.alt || 'Company Logo'}
                    style={{ 
                      height: headerConfig.logo.mobileHeight || 30,
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    className="sm:hidden"
                  />
                )}
                
                {/* Fallback for mobile if no mobile logo */}
                {deviceView === 'mobile' && !headerConfig?.logo?.mobileUrl && headerConfig?.logo?.desktopUrl && (
                  <img
                    src={headerConfig.logo.desktopUrl}
                    alt={headerConfig.logo.alt || 'Company Logo'}
                    style={{ 
                      height: headerConfig.logo.mobileHeight || 30,
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    className="sm:hidden"
                  />
                )}
                
                {/* Fallback text for mobile */}
                {deviceView === 'mobile' && !headerConfig?.logo?.mobileUrl && !headerConfig?.logo?.desktopUrl && (
                  <div className="text-lg font-bold sm:hidden" style={{ color: schemeToUse?.text || '#000000' }}>
                    Aurora
                  </div>
                )}
              </div>
              
              {/* Center section - Logo for drawer layout, Navigation for others */}
              {isDrawerLayout ? (
                <div className="flex items-center justify-center flex-1">
                  {headerConfig?.logo?.desktopUrl ? (
                    <img
                      src={headerConfig.logo.desktopUrl}
                      alt={headerConfig.logo.alt || 'Company Logo'}
                      style={{ 
                        height: headerConfig.logo.height || 40,
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className="text-xl font-bold" style={{ color: schemeToUse?.text || '#000000' }}>
                      Aurora
                    </div>
                  )}
                </div>
              ) : (
                <nav className="flex gap-6">
                  {menuItems.length > 0 ? (
                  menuItems.map((item: any) => (
                    <div 
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => {
                        if (menuOpenOn === 'hover' && item.subItems && item.subItems.length > 0) {
                          setOpenDropdown(item.label);
                        }
                      }}
                      onMouseLeave={() => {
                        if (menuOpenOn === 'hover') {
                          setOpenDropdown(null);
                        }
                      }}
                    >
                      <a 
                        href="#" 
                        className="relative flex items-center gap-1 transition-opacity hover:opacity-80"
                        style={{ 
                          color: schemeToUse?.text || '#000000',
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (menuOpenOn === 'click' && item.subItems && item.subItems.length > 0) {
                            setOpenDropdown(openDropdown === item.label ? null : item.label);
                          }
                        }}
                      >
                        {item.label}
                        {/* Show chevron only on click mode */}
                        {menuOpenOn === 'click' && item.subItems && item.subItems.length > 0 && (
                          <svg 
                            className="w-3 h-3" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        {/* Underline when dropdown is open */}
                        {openDropdown === item.label && (
                          <span 
                            className="absolute left-0 right-0 h-0.5"
                            style={{ 
                              backgroundColor: schemeToUse?.text || '#000000',
                              bottom: '-2px'
                            }}
                          />
                        )}
                      </a>
                      
                      {/* Dropdown menu for subitems */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div 
                          className={`dropdown-menu absolute top-full left-0 mt-2 w-56 transition-all duration-200 z-50 ${
                            openDropdown === item.label ? 'opacity-100 visible' : 'opacity-0 invisible'
                          }`}
                          style={{
                            backgroundColor: schemeToUse?.background || '#ffffff',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          <div className="py-2">
                            {item.subItems.map((subItem: any) => (
                              <a
                                key={subItem.label}
                                href="#"
                                className="block px-6 py-3 text-sm transition-opacity hover:opacity-70"
                                style={{
                                  color: schemeToUse?.text || '#000000',
                                }}
                                onClick={(e) => e.preventDefault()}
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
              )}
              {/* Right section - Icons */}
              <div className="flex items-center gap-4">
                {/* Search Icon */}
                <button className="hover:opacity-70 transition-opacity">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke={schemeToUse?.text || '#000000'}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {/* User Icon */}
                <button className="hover:opacity-70 transition-opacity">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke={schemeToUse?.text || '#000000'}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                {/* Cart Icon */}
                <button className="hover:opacity-70 transition-opacity">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke={schemeToUse?.text || '#000000'}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              </div>
            </div>
            
          </div>
          </>
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

  const renderSection = (section: Section) => {
    // For header sections with drawer, we need to handle the drawer separately
    if (section.type === SectionType.HEADER) {
      const headerConfig = section.settings as any || structuralComponents?.header;
      const isDrawerLayout = headerConfig?.layout === 'drawer';
      
      if (isDrawerLayout) {
        // Get color scheme for drawer
        const selectedSchemeIndex = headerConfig?.colorScheme ? parseInt(headerConfig.colorScheme) - 1 : 0;
        const activeScheme = colorSchemes?.schemes?.[selectedSchemeIndex];
        const fallbackScheme = colorSchemes?.schemes?.[0];
        const schemeToUse = activeScheme || fallbackScheme;
        
        // Get menu items for drawer
        const selectedMenuId = headerConfig?.menuId;
        const selectedMenu = menus?.find(m => m.id === selectedMenuId);
        const menuItems = selectedMenu?.items || [];
        
        return (
          <React.Fragment key={section.id}>
            <div
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
            
            {/* Drawer Menu - Rendered outside the header div */}
            <>
              {/* Overlay - covers content area below header */}
              {drawerOpen && (
                <div 
                  className="absolute bg-black bg-opacity-50"
                  style={{ 
                    top: headerConfig?.height || 80,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 40
                  }}
                  onClick={() => {
                    setDrawerOpen(false);
                    setActiveDrawerSubmenu(null);
                  }}
                />
              )}
              
              {/* Main Drawer */}
              <div 
                className={`absolute bg-white transition-transform duration-300 ${
                  drawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ 
                  left: 0,
                  top: headerConfig?.height || 80,
                  bottom: 0,
                  width: '280px',
                  backgroundColor: schemeToUse?.background || '#ffffff',
                  boxShadow: drawerOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none',
                  zIndex: 50,
                  overflow: 'hidden'
                }}
              >
                {/* Content wrapper for sliding effect */}
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    width: '200%',
                    transform: activeDrawerSubmenu ? 'translateX(-50%)' : 'translateX(0)'
                  }}
                >
                  {/* Main menu panel */}
                  <div className="w-1/2 p-4">
                    {/* Close button */}
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        setActiveDrawerSubmenu(null);
                      }}
                      className="mb-6"
                      style={{ color: schemeToUse?.text || '#000000' }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {/* Menu Items */}
                    <nav className="space-y-2">
                      {menuItems.map((item: any) => (
                        <div key={item.label}>
                          <button
                            onClick={() => {
                              if (item.subItems && item.subItems.length > 0) {
                                setActiveDrawerSubmenu(item.label);
                              }
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-left rounded transition-colors"
                            style={{ 
                              color: schemeToUse?.text || '#000000',
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = schemeToUse?.text ? `${schemeToUse.text}10` : 'rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span className="font-medium">{item.label}</span>
                            {item.subItems && item.subItems.length > 0 && (
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}
                    </nav>
                  </div>
                  
                  {/* Submenu panel */}
                  <div className="w-1/2 p-4">
                    {/* Back button */}
                    <button
                      onClick={() => setActiveDrawerSubmenu(null)}
                      className="flex items-center gap-2 mb-4 text-sm"
                      style={{ color: schemeToUse?.text || '#000000' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Back</span>
                    </button>
                    
                    {/* Submenu Title */}
                    {activeDrawerSubmenu && (
                      <>
                        <h3 className="font-bold text-lg mb-4 uppercase" style={{ color: schemeToUse?.text || '#000000' }}>
                          {activeDrawerSubmenu}
                        </h3>
                        
                        {/* Submenu Items */}
                        <nav className="space-y-2">
                          {menuItems
                            .find((item: any) => item.label === activeDrawerSubmenu)
                            ?.subItems?.map((subItem: any) => (
                              <a
                                key={subItem.label}
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="block px-4 py-3 rounded transition-colors"
                                style={{ 
                                  color: schemeToUse?.text || '#000000',
                                  backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = schemeToUse?.text ? `${schemeToUse.text}10` : 'rgba(0,0,0,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                {subItem.label}
                              </a>
                            ))}
                        </nav>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          </React.Fragment>
        );
      }
    }
    
    // For non-drawer headers and other sections
    return (
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
  };

  const hasContent = headerSections.length > 0 || templateSections.length > 0 || footerSections.length > 0;

  return (
    <div className="flex-1 bg-white h-full flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto flex justify-center bg-gray-100">
        <div className={`bg-white ${getPreviewWidth()} min-h-full shadow-lg flex flex-col relative overflow-hidden`}>
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