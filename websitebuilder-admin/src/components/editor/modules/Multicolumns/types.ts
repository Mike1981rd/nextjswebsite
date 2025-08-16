/**
 * @file types.ts
 * @max-lines 100
 * @module Multicolumns
 * @description Tipos para la sección del template Multicolumns
 * @template-section true
 */

import { SectionType } from '@/types/editor.types';

export interface MulticolumnsConfig {
  // Configuración básica de la sección
  enabled: boolean;
  colorScheme: string;
  
  // Layout y apariencia
  width: 'screen' | 'page' | 'large' | 'medium';
  desktopLayout: 'grid' | 'carousel';
  mobileLayout: '1column' | 'carousel' | 'slideshow';
  
  // Contenido principal
  heading: string;
  body: string;
  headingSize: number; // Factor de escala para override de tamaño
  bodySize: number; // Factor de escala para override de tamaño
  contentAlignment: 'left' | 'center' | 'right';
  
  // Configuración de columnas
  columnsHeadingSize: number; // Tamaño para headings de columnas
  columnsBodySize: number; // Tamaño para body de columnas
  
  // Layout de tarjetas
  desktopCardsPerRow: number;
  desktopSpaceBetweenCards: number;
  desktopSpacing: number;
  mobileSpaceBetweenCards: number; 
  mobileSpacing: number;
  
  // Opciones visuales
  colorColumns: boolean;
  showArrowsOnHover: boolean;
  
  // Botón opcional
  buttonLabel: string;
  buttonLink: string;
  buttonStyle: 'solid' | 'outline';
  
  // Autoplay
  autoplay: 'none' | 'oneAtATime' | 'seamless';
  autoplaySpeed?: number;
  
  // Paddings
  addSidePaddings: boolean;
  topPadding: number;
  bottomPadding: number;
  
  // CSS personalizado
  customCSS: string;
  
  // Items/hijos de la sección
  items: MulticolumnsItemConfig[];
}

export interface MulticolumnsItemConfig {
  id: string;
  visible: boolean;
  icon: string; // Nombre del icono o 'custom'
  customIcon?: string; // SVG personalizado si icon === 'custom'
  iconSize: number;
  heading: string;
  body: string;
  linkLabel: string;
  link: string;
}

export function getDefaultMulticolumnsItemConfig(): MulticolumnsItemConfig {
  return {
    id: `item_${Date.now()}`,
    visible: true,
    icon: 'star',
    iconSize: 64,
    heading: 'Icon column',
    body: 'Pair text with an icon to focus on your chosen product, collection or piece of news. Add details on shipping and return conditions, product availability, care instructions, matching colors and accessories.',
    linkLabel: 'Link label',
    link: ''
  };
}

export function getDefaultMulticolumnsConfig(): MulticolumnsConfig {
  return {
    enabled: true,
    colorScheme: '1',
    width: 'large',
    desktopLayout: 'grid',
    mobileLayout: '1column',
    heading: 'Multicolumn',
    body: '',
    headingSize: 1.0,
    bodySize: 1.0,
    contentAlignment: 'left',
    columnsHeadingSize: 1.0,
    columnsBodySize: 1.0,
    desktopCardsPerRow: 3,
    desktopSpaceBetweenCards: 24,
    desktopSpacing: 24,
    mobileSpaceBetweenCards: 16,
    mobileSpacing: 24,
    colorColumns: false,
    showArrowsOnHover: false,
    buttonLabel: '',
    buttonLink: '',
    buttonStyle: 'solid',
    autoplay: 'none',
    addSidePaddings: false,
    topPadding: 0,
    bottomPadding: 0,
    customCSS: '',
    items: [
      getDefaultMulticolumnsItemConfig(),
      { ...getDefaultMulticolumnsItemConfig(), id: `item_${Date.now() + 1}` },
      { ...getDefaultMulticolumnsItemConfig(), id: `item_${Date.now() + 2}` }
    ]
  };
}

// Tipo de sección para el editor
export const MulticolumnsSectionType = SectionType.MULTICOLUMNS;
