'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { Slider } from '@/components/ui/slider';
import { useGlobalThemeConfig } from '@/hooks/useGlobalThemeConfig';
import { BorderRadiusLabels, BorderRadiusSize } from '@/types/theme/appearance';
import { TypographyConfig, FontConfig, defaultTypography } from '@/types/theme/typography';
import { ColorSchemesConfig, defaultColorSchemes } from '@/types/theme/colorSchemes';
import { FontPicker } from '@/components/ui/font-picker';
import toast from 'react-hot-toast';

interface SettingSection {
  id: string;
  name: string;
  isExpanded: boolean;
}

export function GlobalSettingsPanel() {
  const { toggleGlobalSettings } = useEditorStore();
  const { 
    appearance, 
    typography,
    colorSchemes, 
    loading, 
    updateAppearance, 
    updateTypography,
    updateColorSchemes 
  } = useGlobalThemeConfig();
  const [localAppearance, setLocalAppearance] = useState(appearance);
  const [localTypography, setLocalTypography] = useState<TypographyConfig>(typography || defaultTypography);
  const [localColorSchemes, setLocalColorSchemes] = useState<ColorSchemesConfig>(colorSchemes || defaultColorSchemes);
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [sections, setSections] = useState<SettingSection[]>([
    { id: 'appearance', name: 'Apariencia', isExpanded: false },
    { id: 'typography', name: 'Tipografía', isExpanded: false },
    { id: 'colorSchemes', name: 'Esquemas de color', isExpanded: false },
    { id: 'productCards', name: 'Tarjetas de producto', isExpanded: false },
    { id: 'productBadges', name: 'Insignias de producto', isExpanded: false },
    { id: 'cart', name: 'Carrito', isExpanded: false },
    { id: 'favicon', name: 'Favicon', isExpanded: false },
    { id: 'navigation', name: 'Navegación', isExpanded: false },
    { id: 'socialMedia', name: 'Redes sociales', isExpanded: false },
    { id: 'swatches', name: 'Muestras', isExpanded: false },
  ]);

  useEffect(() => {
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#22c55e');
    }
  }, []);

  useEffect(() => {
    if (appearance) {
      setLocalAppearance(appearance);
    }
  }, [appearance]);

  useEffect(() => {
    if (colorSchemes) {
      setLocalColorSchemes(colorSchemes);
    }
  }, [colorSchemes]);

  // Load Google Fonts when typography changes
  useEffect(() => {
    if (typography) {
      // Collect all unique fonts from typography config
      const fonts = new Set<string>();
      Object.values(typography).forEach((config: any) => {
        if (config?.fontFamily) {
          fonts.add(config.fontFamily);
        }
      });
      
      // Load fonts using WebFont loader if available
      if (fonts.size > 0 && typeof window !== 'undefined') {
        const fontsArray = Array.from(fonts);
        
        // Dynamically load WebFont if not already loaded
        if (!(window as any).WebFont) {
          const script = document.createElement('script');
          script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
          script.onload = () => {
            (window as any).WebFont.load({
              google: {
                families: fontsArray.map(font => `${font}:400,700`)
              }
            });
          };
          document.head.appendChild(script);
        } else {
          (window as any).WebFont.load({
            google: {
              families: fontsArray.map(font => `${font}:400,700`)
            }
          });
        }
      }
    }
  }, [typography]);

  useEffect(() => {
    if (!typography) {
      setLocalTypography(defaultTypography);
      return;
    }
    
    // Always ensure we have a complete typography config with all required fields
    const mergedTypography: TypographyConfig = {
      headings: {
        fontFamily: typography.headings?.fontFamily || defaultTypography.headings.fontFamily,
        fontWeight: typography.headings?.fontWeight !== undefined ? typography.headings.fontWeight : defaultTypography.headings.fontWeight,
        useUppercase: typography.headings?.useUppercase !== undefined ? typography.headings.useUppercase : defaultTypography.headings.useUppercase,
        fontSize: typography.headings?.fontSize !== undefined ? typography.headings.fontSize : defaultTypography.headings.fontSize,
        letterSpacing: typography.headings?.letterSpacing !== undefined ? typography.headings.letterSpacing : defaultTypography.headings.letterSpacing
      },
      body: {
        fontFamily: typography.body?.fontFamily || defaultTypography.body.fontFamily,
        fontWeight: typography.body?.fontWeight !== undefined ? typography.body.fontWeight : defaultTypography.body.fontWeight,
        useUppercase: typography.body?.useUppercase !== undefined ? typography.body.useUppercase : defaultTypography.body.useUppercase,
        fontSize: typography.body?.fontSize !== undefined ? typography.body.fontSize : defaultTypography.body.fontSize,
        letterSpacing: typography.body?.letterSpacing !== undefined ? typography.body.letterSpacing : defaultTypography.body.letterSpacing
      },
      menu: {
        fontFamily: typography.menu?.fontFamily || defaultTypography.menu.fontFamily,
        fontWeight: typography.menu?.fontWeight !== undefined ? typography.menu.fontWeight : defaultTypography.menu.fontWeight,
        useUppercase: typography.menu?.useUppercase !== undefined ? typography.menu.useUppercase : defaultTypography.menu.useUppercase,
        fontSize: typography.menu?.fontSize !== undefined ? typography.menu.fontSize : defaultTypography.menu.fontSize,
        letterSpacing: typography.menu?.letterSpacing !== undefined ? typography.menu.letterSpacing : defaultTypography.menu.letterSpacing
      },
      productCardName: {
        fontFamily: typography.productCardName?.fontFamily || defaultTypography.productCardName.fontFamily,
        fontWeight: typography.productCardName?.fontWeight !== undefined ? typography.productCardName.fontWeight : defaultTypography.productCardName.fontWeight,
        useUppercase: typography.productCardName?.useUppercase !== undefined ? typography.productCardName.useUppercase : defaultTypography.productCardName.useUppercase,
        fontSize: typography.productCardName?.fontSize !== undefined ? typography.productCardName.fontSize : defaultTypography.productCardName.fontSize,
        letterSpacing: typography.productCardName?.letterSpacing !== undefined ? typography.productCardName.letterSpacing : defaultTypography.productCardName.letterSpacing
      },
      buttons: {
        fontFamily: typography.buttons?.fontFamily || defaultTypography.buttons.fontFamily,
        fontWeight: typography.buttons?.fontWeight !== undefined ? typography.buttons.fontWeight : defaultTypography.buttons.fontWeight,
        useUppercase: typography.buttons?.useUppercase !== undefined ? typography.buttons.useUppercase : defaultTypography.buttons.useUppercase,
        fontSize: typography.buttons?.fontSize !== undefined ? typography.buttons.fontSize : defaultTypography.buttons.fontSize,
        letterSpacing: typography.buttons?.letterSpacing !== undefined ? typography.buttons.letterSpacing : defaultTypography.buttons.letterSpacing
      }
    };
    
    console.log('Typography from server:', typography);
    console.log('Merged typography:', mergedTypography);
    setLocalTypography(mergedTypography);
  }, [typography]);

  // Detect changes
  useEffect(() => {
    let hasAnyChange = false;
    
    if (localAppearance && appearance) {
      hasAnyChange = hasAnyChange || 
        localAppearance.pageWidth !== appearance.pageWidth ||
        localAppearance.lateralPadding !== appearance.lateralPadding ||
        localAppearance.borderRadius !== appearance.borderRadius;
    }
    
    if (localTypography && typography) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localTypography) !== JSON.stringify(typography);
    }
    
    if (localColorSchemes && colorSchemes) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localColorSchemes) !== JSON.stringify(colorSchemes);
    }
    
    setHasChanges(hasAnyChange);
  }, [localAppearance, appearance, localTypography, typography, localColorSchemes, colorSchemes]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setSaving(true);
    try {
      const promises = [];
      
      if (localAppearance && localAppearance !== appearance) {
        promises.push(updateAppearance(localAppearance));
      }
      
      if (localTypography && localTypography !== typography) {
        console.log('Saving typography:', localTypography);
        promises.push(updateTypography(localTypography));
      }
      
      if (localColorSchemes && localColorSchemes !== colorSchemes) {
        console.log('Saving color schemes:', localColorSchemes);
        promises.push(updateColorSchemes(localColorSchemes));
      }
      
      await Promise.all(promises);
      toast.success('Configuración guardada exitosamente');
      setHasChanges(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  // Helper function to render typography controls for each section
  const renderTypographySection = (title: string, key: keyof TypographyConfig) => {
    if (!localTypography) return null;
    
    const section = localTypography[key];
    if (!section) return null;
    
    // Ensure fontWeight is always a string
    if (!section.fontWeight || typeof section.fontWeight === 'number') {
      section.fontWeight = '400';
    }
    
    return (
      <div className="space-y-3 pb-3">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</h4>
        
        {/* Font Family Input */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Fuente</label>
          <FontPicker
            value={section?.fontFamily || ''}
            onChange={(font) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], fontFamily: font }
            }))}
            placeholder="Buscar fuentes..."
            primaryColor={primaryColor}
          />
        </div>

        {/* Use Uppercase Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-600">Usar mayúsculas</label>
          <button
            onClick={() => {
              const newValue = !section.useUppercase;
              setLocalTypography(prev => ({
                ...prev,
                [key]: { ...prev[key], useUppercase: newValue }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              section?.useUppercase ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                section?.useUppercase ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Font Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-600">Tamaño de fuente</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={section?.fontSize || 100}
                onChange={(e) => setLocalTypography(prev => ({
                  ...prev,
                  [key]: { ...prev[key], fontSize: parseInt(e.target.value) || 100 }
                }))}
                className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded text-center"
                min="8"
                max="200"
              />
              <span className="text-xs text-gray-500">
                {(section?.fontSize || 100) <= 100 ? '%' : 'px'}
              </span>
            </div>
          </div>
          <Slider
            value={[section?.fontSize || 100]}
            onValueChange={(value) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], fontSize: value[0] }
            }))}
            min={8}
            max={200}
            step={1}
            className="w-full"
            primaryColor={primaryColor}
          />
        </div>

        {/* Letter Spacing Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-600">Espaciado entre letras</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={section?.letterSpacing || 0}
                onChange={(e) => setLocalTypography(prev => ({
                  ...prev,
                  [key]: { ...prev[key], letterSpacing: parseFloat(e.target.value) || 0 }
                }))}
                className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded text-center"
                min="-5"
                max="10"
                step="0.1"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <Slider
            value={[section?.letterSpacing || 0]}
            onValueChange={(value) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], letterSpacing: value[0] }
            }))}
            min={-5}
            max={10}
            step={0.1}
            className="w-full"
            primaryColor={primaryColor}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-[280px] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleGlobalSettings()}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">Configuración del tema</span>
          </div>
          
          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Sections List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{section.name}</span>
              {section.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {section.isExpanded && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                {section.id === 'appearance' && (
                  <div className="space-y-6">
                    {/* Page Width Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Page width
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={localAppearance?.pageWidth || 1400}
                            onChange={(e) => setLocalAppearance(prev => 
                              prev ? { ...prev, pageWidth: parseInt(e.target.value) || 1400 } : prev
                            )}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                            min="320"
                            max="3000"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <Slider
                        value={[localAppearance?.pageWidth || 1400]}
                        onValueChange={(value) => setLocalAppearance(prev => 
                          prev ? { ...prev, pageWidth: value[0] } : prev
                        )}
                        min={320}
                        max={3000}
                        step={10}
                        className="w-full"
                        primaryColor={primaryColor}
                      />
                    </div>

                    {/* Side Padding Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Side padding size
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={localAppearance?.lateralPadding || 34}
                            onChange={(e) => setLocalAppearance(prev => 
                              prev ? { ...prev, lateralPadding: parseInt(e.target.value) || 34 } : prev
                            )}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                            min="0"
                            max="200"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <Slider
                        value={[localAppearance?.lateralPadding || 34]}
                        onValueChange={(value) => setLocalAppearance(prev => 
                          prev ? { ...prev, lateralPadding: value[0] } : prev
                        )}
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                        primaryColor={primaryColor}
                      />
                    </div>

                    {/* Border Radius Select */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Edge rounding
                      </label>
                      <select 
                        value={localAppearance?.borderRadius || 'size-3'}
                        onChange={(e) => setLocalAppearance(prev => 
                          prev ? { ...prev, borderRadius: e.target.value as BorderRadiusSize } : prev
                        )}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2"
                        style={{ 
                          '--tw-ring-color': primaryColor,
                        } as React.CSSProperties}
                      >
                        {Object.entries(BorderRadiusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                {section.id === 'typography' && localTypography && (
                  <div className="space-y-6">
                    {renderTypographySection('Encabezados', 'headings')}
                    {renderTypographySection('Cuerpo', 'body')}
                    {renderTypographySection('Menú', 'menu')}
                    {renderTypographySection('Nombre de tarjeta de producto', 'productCardName')}
                    {renderTypographySection('Botones', 'buttons')}
                  </div>
                )}
                
                {section.id === 'colorSchemes' && (
                  <div className="space-y-3">
                    {/* Scheme Selector - Compact Design */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        Select Scheme to Configure
                      </label>
                      <select 
                        value={localColorSchemes?.defaultScheme || 'scheme-1'}
                        onChange={(e) => {
                          setLocalColorSchemes(prev => ({
                            ...prev,
                            defaultScheme: e.target.value
                          }));
                        }}
                        className="w-full px-2.5 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      >
                        {localColorSchemes?.schemes.map(scheme => (
                          <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Fields - Compact Layout */}
                    {localColorSchemes && (() => {
                      const activeScheme = localColorSchemes.schemes.find(
                        s => s.id === localColorSchemes.defaultScheme
                      ) || localColorSchemes.schemes[0];

                      if (!activeScheme) return null;

                      const colorGroups = [
                        {
                          title: 'Basic',
                          colors: [
                            { key: 'text', label: 'Text' },
                            { key: 'background', label: 'Background' },
                            { key: 'foreground', label: 'Foreground' },
                            { key: 'border', label: 'Border' },
                            { key: 'link', label: 'Link' }
                          ]
                        },
                        {
                          title: 'Buttons',
                          colors: [
                            { key: 'solidButton', label: 'Solid button' },
                            { key: 'solidButtonText', label: 'Solid button text' },
                            { key: 'outlineButton', label: 'Outline button' },
                            { key: 'outlineButtonText', label: 'Outline button text' }
                          ]
                        },
                        {
                          title: 'Effects',
                          colors: [
                            { key: 'imageOverlay', label: 'Image overlay' }
                          ]
                        }
                      ];

                      return (
                        <div className="space-y-3">
                          {colorGroups.map(group => (
                            <div key={group.title}>
                              <h5 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {group.title}
                              </h5>
                              <div className="space-y-2">
                                {group.colors.map(({ key, label }) => (
                                  <div key={key} className="flex items-center gap-1.5">
                                    <label className="text-xs text-gray-600 w-20 flex-shrink-0">
                                      {label}
                                    </label>
                                    <input
                                      type="color"
                                      value={activeScheme[key as keyof typeof activeScheme] as string || '#000000'}
                                      onChange={(e) => {
                                        const updatedSchemes = localColorSchemes.schemes.map(s => 
                                          s.id === activeScheme.id 
                                            ? { ...s, [key]: e.target.value }
                                            : s
                                        );
                                        setLocalColorSchemes({
                                          ...localColorSchemes,
                                          schemes: updatedSchemes
                                        });
                                      }}
                                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={activeScheme[key as keyof typeof activeScheme] as string || ''}
                                      onChange={(e) => {
                                        const updatedSchemes = localColorSchemes.schemes.map(s => 
                                          s.id === activeScheme.id 
                                            ? { ...s, [key]: e.target.value }
                                            : s
                                        );
                                        setLocalColorSchemes({
                                          ...localColorSchemes,
                                          schemes: updatedSchemes
                                        });
                                      }}
                                      className="w-24 px-1.5 py-1 text-xs font-mono border border-gray-300 rounded focus:border-blue-400 focus:outline-none"
                                      placeholder={key === 'imageOverlay' ? 'rgba(0,0,0,0.1)' : '#000000'}
                                    />
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          activeScheme[key as keyof typeof activeScheme] as string || ''
                                        );
                                        toast.success('Copied!', { duration: 1000 });
                                      }}
                                      className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                      title="Copy"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {!['appearance', 'typography', 'colorSchemes'].includes(section.id) && (
                  <p className="text-xs text-gray-500">Configuración próximamente...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}