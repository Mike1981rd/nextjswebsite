/**
 * @file PreviewMulticolumns.tsx
 * @max-lines 400
 * @module Multicolumns
 * @description Componente Preview UNIFICADO para editor y preview real
 * @unified-architecture true
 * @created 2025-08-16
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import { MulticolumnsConfig } from '@/components/editor/modules/Multicolumns/types';

interface PreviewMulticolumnsProps {
  config: MulticolumnsConfig;
  theme?: any;  // Theme desde API en preview real
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;  // CRÍTICO: Diferencia entre contextos
}

export default function PreviewMulticolumns({ 
  config, 
  theme,
  deviceView,
  isEditor = false
}: PreviewMulticolumnsProps) {
  
  // 🎯 PATRÓN DUAL: Theme desde prop (preview real) o store (editor)
  const storeThemeConfig = useThemeConfigStore(state => state.config);
  const themeConfig = theme || storeThemeConfig;
  
  // ⚠️ DETECCIÓN MÓVIL OBLIGATORIA
  const [isMobile, setIsMobile] = useState(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  
  // Sincronizar con cambios de deviceView o viewport
  useEffect(() => {
    const checkMobile = () => {
      if (deviceView !== undefined) {
        setIsMobile(deviceView === 'mobile');
        return;
      }
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [deviceView]);
  
  // Obtener color scheme seleccionado
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) {
      return {
        text: { default: '#000000' },
        background: { default: '#FFFFFF' },
        solidButton: { default: '#000000' },
        solidButtonText: { default: '#FFFFFF' },
        outlineButton: { default: '#000000' },
        outlineButtonText: { default: '#000000' },
      };
    }
    
    const schemeIndex = parseInt(config.colorScheme || '1') - 1;
    return themeConfig.colorSchemes.schemes[schemeIndex] || themeConfig.colorSchemes.schemes[0];
  }, [themeConfig, config.colorScheme]);
  
  // TODOS LOS HOOKS ANTES DE RETURNS CONDICIONALES
  
  // Validación DESPUÉS de todos los hooks
  if (!config?.enabled && !isEditor) {
    return null;
  }
  
  // Clases responsive basadas en isMobile
  const containerClass = isMobile ? 'px-4' : 'px-8';
  const textSize = isMobile ? 'text-sm' : 'text-base';
  const spacing = isMobile ? 'gap-2' : 'gap-4';
  
  // Padding basado en configuración
  const paddingClasses = {
    none: '',
    small: isMobile ? 'py-2' : 'py-4',
    medium: isMobile ? 'py-4' : 'py-8',
    large: isMobile ? 'py-6' : 'py-12',
  };
  
  // Width basado en configuración
  const widthClasses = {
    screen: 'w-full',
    page: 'max-w-7xl mx-auto',
    large: 'max-w-5xl mx-auto',
    medium: 'max-w-3xl mx-auto',
  };
  
  return (
    <section
      className={`
        ${paddingClasses[config.topPadding?.toString() as keyof typeof paddingClasses || 'medium']}
        ${paddingClasses[config.bottomPadding?.toString() as keyof typeof paddingClasses || 'medium']}
      `}
      style={{
        backgroundColor: colorScheme.background?.default || '#FFFFFF',
        color: colorScheme.text?.default || '#000000',
      }}
    >
      <div className={`${widthClasses[config.width || 'page']} ${containerClass}`}>
        {/* TODO: Implementar el contenido del módulo */}
        <div className={`${spacing} ${textSize}`}>
          <h2>Preview Multicolumns</h2>
          <p>Implementar contenido aquí</p>
          
          {/* Renderizar items si existen */}
          {config.items?.map((item, index) => (
            item.visible && (
              <div key={item.id} className="border p-4 rounded">
                <h3>{item.heading || `Item ${index + 1}`}</h3>
                {/* TODO: Renderizar contenido del item */}
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
