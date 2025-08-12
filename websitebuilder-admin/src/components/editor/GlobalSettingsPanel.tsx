'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';

interface SettingSection {
  id: string;
  name: string;
  isExpanded: boolean;
}

export function GlobalSettingsPanel() {
  const { toggleGlobalSettings } = useEditorStore();
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

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  return (
    <div className="w-[280px] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleGlobalSettings()}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-900">Configuración del tema</span>
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
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ancho de página
                      </label>
                      <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="1200">1200px</option>
                        <option value="1400">1400px</option>
                        <option value="1600">1600px</option>
                        <option value="full">Ancho completo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Padding de página
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Radio de borde
                      </label>
                      <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="none">Sin redondeo</option>
                        <option value="small">Pequeño</option>
                        <option value="medium">Medio</option>
                        <option value="large">Grande</option>
                        <option value="extra-large">Extra grande</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {section.id === 'typography' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fuente de encabezados
                      </label>
                      <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="poppins">Poppins</option>
                        <option value="playfair">Playfair Display</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fuente del cuerpo
                      </label>
                      <select className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="opensans">Open Sans</option>
                        <option value="lato">Lato</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {section.id === 'colorSchemes' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Color primario
                      </label>
                      <input 
                        type="color" 
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                        defaultValue="#000000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Color secundario
                      </label>
                      <input 
                        type="color" 
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                        defaultValue="#666666"
                      />
                    </div>
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