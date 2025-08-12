'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Image, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo, 
  Redo, 
  Eye,
  Home,
  Package,
  ShoppingCart,
  CreditCard,
  Grid,
  LayoutGrid,
  Box,
  FileText
} from 'lucide-react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { useEditorStore } from '@/stores/useEditorStore';
import { PageType } from '@/types/editor.types';
import { useEditorTranslations } from '@/hooks/useEditorTranslations';

export default function EditorPage() {
  const { 
    selectedPageId: storePageId, 
    selectedPageType,
    setSelectedPage, 
    isDirty, 
    isSaving, 
    savePage,
    loadPageSections 
  } = useEditorStore();
  
  const { t } = useEditorTranslations();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Create mock pages with translations and icons
  const mockPages = useMemo(() => [
    { id: '1', name: t('editor.pageTypes.home', 'Página de inicio'), type: PageType.HOME, icon: Home },
    { id: '2', name: t('editor.pageTypes.product', 'Página de producto'), type: PageType.PRODUCT, icon: Package },
    { id: '3', name: t('editor.pageTypes.cart', 'Carrito'), type: PageType.CART, icon: ShoppingCart },
    { id: '4', name: t('editor.pageTypes.checkout', 'Finalizar compra'), type: PageType.CHECKOUT, icon: CreditCard },
    { id: '5', name: t('editor.pageTypes.collection', 'Colección'), type: PageType.COLLECTION, icon: Grid },
    { id: '6', name: t('editor.pageTypes.allCollections', 'Todas las colecciones'), type: PageType.ALL_COLLECTIONS, icon: LayoutGrid },
    { id: '7', name: t('editor.pageTypes.allProducts', 'Todos los productos'), type: PageType.ALL_PRODUCTS, icon: Box },
    { id: '8', name: t('editor.pageTypes.custom', 'Página personalizada'), type: PageType.CUSTOM, icon: FileText }
  ], [t]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState(mockPages[0]?.id || '1');
  
  // Find the selected page from mockPages (this will update when language changes)
  const selectedPage = mockPages.find(p => p.id === selectedPageId) || mockPages[0];

  // Clear console logs when entering the editor
  useEffect(() => {
    if (typeof window !== 'undefined' && console.clear) {
      console.clear();
      // Silent initialization - no logs
    }
  }, []);

  useEffect(() => {
    // Load initial page after translations are ready
    if (!storePageId && mockPages.length > 0) {
      handlePageSelect(mockPages[0]);
    }
  }, [mockPages, storePageId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handlePageSelect = (page: typeof mockPages[0]) => {
    setSelectedPageId(page.id);
    setSelectedPage(page.id, page.type);
    setIsDropdownOpen(false);
    
    // Load page sections from API (mock for now)
    if (page.type === PageType.PRODUCT) {
      // Product pages always have product information
      loadPageSections([
        {
          id: 'product_info_1',
          type: 'product_information' as any,
          name: 'Product information',
          visible: true,
          settings: {},
          sortOrder: 0
        }
      ]);
    } else {
      // Other pages start empty
      loadPageSections([]);
    }
  };

  const handleSave = async () => {
    await savePage();
    // Show success message
    console.log('Page saved successfully');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={t('editor.actions.exit', 'Salir del Editor')}
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Aurora</span>
            </div>
            
            {/* Global Settings */}
            <button 
              onClick={() => {
                const store = useEditorStore.getState();
                store.toggleGlobalSettings();
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={t('editor.panels.globalSettings', 'Configuración Global')}
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Center Section - Page Selector */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors"
              >
                {selectedPage.icon && <selectedPage.icon className="w-4 h-4 text-gray-600" />}
                <span className="text-gray-700">{selectedPage.name}</span>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {mockPages.map((page) => {
                    const PageIcon = page.icon;
                    const isSelected = page.id === selectedPageId;
                    return (
                      <button
                        key={page.id}
                        onClick={() => handlePageSelect(page)}
                        className={`
                          w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg
                          flex items-center gap-3
                          ${isSelected 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'hover:bg-gray-50 text-gray-700'
                          }
                        `}
                      >
                        <PageIcon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span>{page.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.actions.undo', 'Deshacer')}>
              <Undo className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.actions.redo', 'Rehacer')}>
              <Redo className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Device Preview Icons */}
            <div className="flex items-center gap-1 ml-2">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.toolbar.desktop', 'Escritorio')}>
                <Monitor className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.toolbar.tablet', 'Tablet')}>
                <Tablet className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.toolbar.mobile', 'Móvil')}>
                <Smartphone className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.actions.preview', 'Vista Previa')}>
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`
                ml-3 px-4 py-1.5 rounded text-sm font-medium transition-all
                ${isDirty 
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSaving ? t('editor.messages.saving', 'Guardando...') : t('editor.actions.save', 'Guardar')}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden relative">
        <EditorLayout />
      </div>
    </div>
  );
}