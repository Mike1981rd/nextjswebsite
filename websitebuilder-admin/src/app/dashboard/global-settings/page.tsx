'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface SettingSection {
  id: string;
  name: string;
  isExpanded: boolean;
}

export default function GlobalSettingsPage() {
  const { t } = useI18n();
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

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'appearance':
        return (
          <div className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">Configuración de Apariencia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ancho de página
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1200">1200px</option>
                  <option value="1400">1400px</option>
                  <option value="1600">1600px</option>
                  <option value="full">Ancho completo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Padding de página
                </label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radio de borde
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="none">Sin redondeo</option>
                  <option value="small">Pequeño</option>
                  <option value="medium">Medio</option>
                  <option value="large">Grande</option>
                  <option value="extra-large">Extra grande</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'typography':
        return (
          <div className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">Configuración de Tipografía</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuente de encabezados
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="poppins">Poppins</option>
                  <option value="playfair">Playfair Display</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuente del cuerpo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="opensans">Open Sans</option>
                  <option value="lato">Lato</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'colorSchemes':
        return (
          <div className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">Esquemas de Color</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color primario
                  </label>
                  <input 
                    type="color" 
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    defaultValue="#000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color secundario
                  </label>
                  <input 
                    type="color" 
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    defaultValue="#666666"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-white">
            <p className="text-gray-500">Configuración de {sections.find(s => s.id === sectionId)?.name} próximamente...</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del tema</h1>
      </div>

      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{section.name}</span>
              {section.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {section.isExpanded && (
              <div className="border-t border-gray-200">
                {renderSectionContent(section.id)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}