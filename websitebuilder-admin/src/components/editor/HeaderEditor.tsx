import React, { useState, useEffect } from 'react';
import { HeaderConfig, defaultHeaderConfig } from '@/types/components/header';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useColorSchemes } from '@/hooks/useColorSchemes';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';

interface HeaderEditorProps {
  value: HeaderConfig;
  onChange: (value: HeaderConfig) => void;
}

export function HeaderEditor({ value, onChange }: HeaderEditorProps) {
  const [localConfig, setLocalConfig] = useState<HeaderConfig>(value || defaultHeaderConfig);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    themeConfig: false,
    cssPersonalized: false
  });
  const { colorSchemes, loading: schemesLoading } = useColorSchemes();
  const { menus, loading: menusLoading } = useNavigationMenus();

  // Debug: Log when color schemes change
  useEffect(() => {
    console.log('[HeaderEditor] Color schemes updated:', colorSchemes?.schemes?.length, 'schemes available');
    if (colorSchemes?.schemes) {
      console.log('[HeaderEditor] Scheme 3:', colorSchemes.schemes[2]);
      console.log('[HeaderEditor] Scheme 4:', colorSchemes.schemes[3]);
      console.log('[HeaderEditor] Scheme 5:', colorSchemes.schemes[4]);
    }
  }, [colorSchemes]);

  useEffect(() => {
    // Force update local config when value changes (important for undo)
    setLocalConfig(value || defaultHeaderConfig);
  }, [value, JSON.stringify(value)]);

  const handleChange = (path: string, newValue: any) => {
    const keys = path.split('.');
    const updated = { ...localConfig };
    let current: any = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    // Only update if the value actually changed
    const oldValue = current[keys[keys.length - 1]];
    if (oldValue === newValue) {
      return; // No change, don't trigger onChange
    }
    
    current[keys[keys.length - 1]] = newValue;
    setLocalConfig(updated);
    onChange(updated);
  };

  const getValue = (path: string) => {
    const keys = path.split('.');
    let current: any = localConfig;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Color scheme */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Color scheme
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={getValue('colorScheme') || '1'}
          onChange={(e) => handleChange('colorScheme', e.target.value)}
          disabled={schemesLoading}
        >
          {schemesLoading ? (
            <option>Loading schemes...</option>
          ) : colorSchemes?.schemes ? (
            colorSchemes.schemes.map((scheme, index) => (
              <option key={scheme.id} value={(index + 1).toString()}>
                {scheme.name}
              </option>
            ))
          ) : (
            <>
              <option value="1">Scheme 1</option>
              <option value="2">Scheme 2</option>
              <option value="3">Scheme 3</option>
              <option value="4">Scheme 4</option>
              <option value="5">Scheme 5</option>
            </>
          )}
        </select>
        <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
          Learn about color schemes
        </button>
        {colorSchemes && getValue('colorScheme') && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 mb-1">Preview colors:</p>
            <div className="flex gap-1">
              {(() => {
                const schemeIndex = parseInt(getValue('colorScheme') || '1') - 1;
                const selectedScheme = colorSchemes.schemes[schemeIndex];
                
                if (!selectedScheme) {
                  return <p className="text-xs text-gray-500">Scheme not found</p>;
                }
                
                return (
                  <>
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: selectedScheme.background || '#FFFFFF' }}
                      title={`Background: ${selectedScheme.background}`}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: selectedScheme.text || '#000000' }}
                      title={`Text: ${selectedScheme.text}`}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: selectedScheme.foreground || '#F5E076' }}
                      title={`Foreground: ${selectedScheme.foreground}`}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: selectedScheme.solidButton || '#000000' }}
                      title={`Button: ${selectedScheme.solidButton}`}
                    />
                    <div 
                      className="w-6 h-6 rounded border border-gray-300" 
                      style={{ backgroundColor: selectedScheme.link || '#0066CC' }}
                      title={`Link: ${selectedScheme.link}`}
                    />
                  </>
                );
              })()}
            </div>
            {(() => {
              const schemeIndex = parseInt(getValue('colorScheme') || '1') - 1;
              const selectedScheme = colorSchemes.schemes[schemeIndex];
              if (selectedScheme) {
                return (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedScheme.name} - Index: {schemeIndex + 1}
                  </p>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>

      {/* Width */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Width
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={getValue('width') || 'page'}
          onChange={(e) => handleChange('width', e.target.value)}
        >
          <option value="screen">Screen</option>
          <option value="page">Page</option>
          <option value="large">Large</option>
          <option value="medium">Medium</option>
        </select>
      </div>

      {/* Height */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Header Height
        </label>
        <div className="flex items-center gap-3">
          <Slider
            value={[getValue('height') || 80]}
            onValueChange={(values) => handleChange('height', values[0])}
            min={60}
            max={150}
            step={5}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="w-14 px-2 py-1 text-sm border border-gray-300 rounded"
              value={getValue('height') || 80}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 80)}
              min={60}
              max={150}
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Adjusts the overall height of the header section
        </p>
      </div>

      {/* Layout */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Layout
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={getValue('layout') || 'drawer'}
          onChange={(e) => handleChange('layout', e.target.value)}
        >
          <option value="drawer">Drawer</option>
          <option value="logo-left-menu-center-inline">Logo left, menu center inline</option>
          <option value="logo-left-menu-left-inline">Logo left, menu left inline</option>
          <option value="logo-center-menu-left-inline">Logo center, menu left inline</option>
          <option value="logo-center-menu-center-below">Logo center, menu center below</option>
          <option value="logo-left-menu-left-below">Logo left, menu left below</option>
        </select>
        <span className="text-xs text-gray-500 mt-1">
          Layout is auto-optimized for mobile
        </span>
      </div>

      {/* Show separator */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Show separator</label>
        <button
          onClick={() => handleChange('showSeparator', !getValue('showSeparator'))}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            getValue('showSeparator') ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            getValue('showSeparator') ? 'translate-x-5' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Enable sticky header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Enable sticky header</label>
        <button
          onClick={() => handleChange('sticky.enabled', !getValue('sticky.enabled'))}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            getValue('sticky.enabled') ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            getValue('sticky.enabled') ? 'translate-x-5' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Menu Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Menu</h3>
        
        {/* Open menu dropdown */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Open menu dropdown
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('menuOpenOn', 'hover')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  getValue('menuOpenOn') === 'hover' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On hover
              </button>
              <button
                onClick={() => handleChange('menuOpenOn', 'click')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  getValue('menuOpenOn') === 'click' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                On click
              </button>
            </div>
          </div>

          {/* Choose navigation menu */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Choose navigation menu
            </label>
            <select 
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={getValue('menuId') || ''}
              onChange={(e) => handleChange('menuId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={menusLoading}
            >
              {menusLoading ? (
                <option value="">Loading menus...</option>
              ) : menus.length > 0 ? (
                <>
                  <option value="">Select a menu</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id.toString()}>
                      {menu.name} ({menu.identifier})
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No menus available</option>
              )}
            </select>
            {menus.length === 0 && !menusLoading && (
              <p className="text-xs text-amber-600 mt-1">
                No navigation menus found. Please create a menu in the Navigation module first.
              </p>
            )}
            {getValue('menuId') && menus.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600 mb-1">Selected menu items:</p>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  {menus
                    .find(m => m.id === getValue('menuId'))
                    ?.items?.slice(0, 5).map((item, idx) => (
                      <li key={idx}>• {item.label}</li>
                    ))}
                  {menus.find(m => m.id === getValue('menuId'))?.items && 
                   menus.find(m => m.id === getValue('menuId'))!.items!.length > 5 && (
                    <li className="text-gray-500">... and {menus.find(m => m.id === getValue('menuId'))!.items!.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Logo</h3>
        
        {/* Desktop logo */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Desktop logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              {getValue('logo.desktopUrl') ? (
                <div className="flex items-center justify-between">
                  <img 
                    src={getValue('logo.desktopUrl')} 
                    alt="Desktop logo"
                    className="h-12 object-contain"
                  />
                  <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Change
                  </button>
                </div>
              ) : (
                <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
                  Select image
                </button>
              )}
            </div>
          </div>

          {/* Desktop logo size */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Desktop logo size
            </label>
            <div className="flex items-center gap-3">
              <Slider
                value={[getValue('logo.height') || 190]}
                onValueChange={(values) => handleChange('logo.height', values[0])}
                min={50}
                max={250}
                step={5}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  className="w-14 px-2 py-1 text-sm border border-gray-300 rounded"
                  value={getValue('logo.height') || 190}
                  onChange={(e) => handleChange('logo.height', parseInt(e.target.value) || 190)}
                  min={50}
                  max={250}
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>

          {/* Mobile logo */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Mobile logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
                Select image
              </button>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
              Explore free images
            </button>
          </div>

          {/* Mobile logo size */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Mobile logo size
            </label>
            <div className="flex items-center gap-3">
              <Slider
                value={[getValue('logo.mobileHeight') || 120]}
                onValueChange={(values) => handleChange('logo.mobileHeight', values[0])}
                min={50}
                max={200}
                step={5}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  className="w-14 px-2 py-1 text-sm border border-gray-300 rounded"
                  value={getValue('logo.mobileHeight') || 120}
                  onChange={(e) => handleChange('logo.mobileHeight', parseInt(e.target.value) || 120)}
                  min={50}
                  max={200}
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icons Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Icons</h3>
        
        {/* Icon style */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Icon style
            </label>
            <select 
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={getValue('iconStyle') || 'style2-outline'}
              onChange={(e) => handleChange('iconStyle', e.target.value)}
            >
              <option value="style1-solid">Style 1 - solid</option>
              <option value="style1-outline">Style 1 - outline</option>
              <option value="style2-solid">Style 2 - solid</option>
              <option value="style2-outline">Style 2 - outline</option>
            </select>
          </div>

          {/* Cart type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Cart type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('cart.style', 'bag')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  getValue('cart.style') === 'bag' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bag
              </button>
              <button
                onClick={() => handleChange('cart.style', 'cart')}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  getValue('cart.style') === 'cart' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración del tema - Expandable Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('themeConfig')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-semibold text-gray-900">Configuración del tema</h3>
          {expandedSections.themeConfig ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.themeConfig && (
          <div className="mt-3 space-y-3">
            {/* Show sticky cart */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Show sticky cart</label>
              <button
                onClick={() => handleChange('stickyCart', !getValue('stickyCart'))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  getValue('stickyCart') ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  getValue('stickyCart') ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Edge rounding */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Edge rounding
              </label>
              <select 
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={getValue('edgeRounding') || 'size0'}
                onChange={(e) => handleChange('edgeRounding', e.target.value)}
              >
                <option value="size0">Size 0 - None</option>
                <option value="size1">Size 1 - 2px</option>
                <option value="size2">Size 2 - 4px</option>
                <option value="size3">Size 3 - 8px</option>
                <option value="size4">Size 4 - 12px</option>
                <option value="size5">Size 5 - 16px</option>
                <option value="size6">Size 6 - 20px</option>
                <option value="size7">Size 7 - 24px</option>
                <option value="size8">Size 8 - 28px</option>
              </select>
            </div>

            {/* Show as - First dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Show as
              </label>
              <select 
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={getValue('showAs1') || 'drawer-and-page'}
                onChange={(e) => handleChange('showAs1', e.target.value)}
              >
                <option value="drawer-and-page">Drawer and page</option>
                <option value="page-only">Page only</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Show as - Second dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Show as
              </label>
              <select 
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={getValue('showAs2') || 'drawer-and-page'}
                onChange={(e) => handleChange('showAs2', e.target.value)}
              >
                <option value="drawer-and-page">Drawer and page</option>
                <option value="page-only">Page only</option>
                <option value="none">None</option>
              </select>
            </div>

            <button className="text-xs text-blue-600 hover:text-blue-700">
              Learn about cart view
            </button>
          </div>
        )}
      </div>

      {/* CSS personalizado - Expandable Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('cssPersonalized')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-semibold text-gray-900">CSS personalizado</h3>
          {expandedSections.cssPersonalized ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.cssPersonalized && (
          <div className="mt-3">
            <textarea
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              rows={6}
              placeholder="/* Add your custom CSS here */"
              value={getValue('customCss') || ''}
              onChange={(e) => handleChange('customCss', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Add custom CSS to style the header. Use standard CSS syntax.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}