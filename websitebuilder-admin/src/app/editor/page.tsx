'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { StructuralComponentsProvider } from '@/contexts/StructuralComponentsContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Settings, 
  Image, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo, 
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
import { PageType, SectionType } from '@/types/editor.types';
import { useEditorTranslations } from '@/hooks/useEditorTranslations';
import { useStructuralComponents } from '@/hooks/useStructuralComponents';
import { useCompany } from '@/hooks/useCompany';
import { StructuralComponentsSync } from '@/components/editor/StructuralComponentsSync';

function EditorPageContent() {
  const { 
    selectedPageId: storePageId, 
    selectedPageType,
    setSelectedPage, 
    isDirty, 
    isSaving, 
    savePage,
    loadPageSections,
    initializeStructuralComponents,
    undo,
    canUndo
  } = useEditorStore();
  
  const { t } = useEditorTranslations();
  const { company } = useCompany();
  
  // Save company ID to localStorage for preview
  useEffect(() => {
    if (company?.id) {
      localStorage.setItem('companyId', company.id.toString());
      console.log('Saved company ID to localStorage:', company.id);
    }
  }, [company?.id]);
  
  const { 
    config: structuralConfig, 
    hasChanges: hasStructuralChanges,
    publish: publishStructural,
    refresh 
  } = useStructuralComponents();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  
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
  
  // Monitor hasStructuralChanges and isDirty for debugging
  useEffect(() => {
    console.log('[DEBUG] EditorPage - hasStructuralChanges:', hasStructuralChanges, 'isDirty:', isDirty);
  }, [hasStructuralChanges, isDirty]);

  // Keyboard shortcut for Undo only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
          // Also refresh structural components to reset hasChanges
          refresh();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, canUndo, refresh]);


  useEffect(() => {
    // Load initial page after translations are ready
    if (!storePageId && mockPages.length > 0) {
      handlePageSelect(mockPages[0]);
    }
  }, [mockPages, storePageId]);

  // Initialize structural components once when editor loads
  useEffect(() => {
    if (!hasInitialized) {
      initializeStructuralComponents();
      // Save initial state to history
      const store = useEditorStore.getState();
      store.saveHistory();
      setHasInitialized(true);
    }
  }, [hasInitialized, initializeStructuralComponents]);

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

  const [isSavingLocal, setIsSavingLocal] = useState(false);
  
  const handleSave = async () => {
    setIsSavingLocal(true);
    try {
      // Save structural components if they have changes
      if (hasStructuralChanges) {
        const success = await publishStructural();
        if (success) {
          // Force a complete refresh of the structural components
          await refresh();
        }
      }
      
      // Save sections order if they were reordered (isDirty)
      if (isDirty) {
        // For now, just clear the dirty flag since we don't have a backend endpoint for section order yet
        // TODO: Implement API endpoint to save section order
        console.log('[Save] Section order changes detected - marking as saved');
        const store = useEditorStore.getState();
        store.setIsDirty(false);
        
        // Show success message
        toast.success('Cambios guardados exitosamente');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSavingLocal(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sync component for structural components */}
      <StructuralComponentsSync />
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
            {/* Undo only */}
            <button 
              onClick={() => {
                undo();
                refresh(); // Reset structural components hasChanges
              }}
              disabled={!canUndo()}
              className={`p-1.5 rounded transition-colors ${
                canUndo() 
                  ? 'hover:bg-gray-100 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`} 
              title={t('editor.actions.undo', 'Deshacer')}
            >
              <Undo className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Device Preview Icons */}
            <div className="flex items-center gap-1 ml-2">
              <button 
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'desktop' 
                    ? 'bg-gray-200' 
                    : 'hover:bg-gray-100'
                }`} 
                title={t('editor.toolbar.desktop', 'Escritorio')}
              >
                <Monitor className={`w-4 h-4 ${
                  deviceView === 'desktop' ? 'text-gray-900' : 'text-gray-600'
                }`} />
              </button>
              {/* Tablet button hidden as requested */}
              {/* <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title={t('editor.toolbar.tablet', 'Tablet')}>
                <Tablet className="w-4 h-4 text-gray-600" />
              </button> */}
              <button 
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  deviceView === 'mobile' 
                    ? 'bg-gray-200' 
                    : 'hover:bg-gray-100'
                }`} 
                title={t('editor.toolbar.mobile', 'Móvil')}
              >
                <Smartphone className={`w-4 h-4 ${
                  deviceView === 'mobile' ? 'text-gray-900' : 'text-gray-600'
                }`} />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <button 
                onClick={() => {
                  // Open preview in new tab with the current page handle
                  const handle = selectedPage.type;
                  window.open(`/${handle}`, '_blank');
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors" 
                title={t('editor.actions.preview', 'Vista Previa')}
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Save Button - NUEVO Y SIMPLE */}
            <button
              onClick={handleSave}
              disabled={isSavingLocal || (!hasStructuralChanges && !isDirty)}
              className={`
                ml-3 px-4 py-1.5 rounded text-sm font-medium transition-all
                ${(!isSavingLocal && (hasStructuralChanges || isDirty))
                  ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSavingLocal ? 'Guardando...' : 'Guardar'}
            </button>

            {/* Publish Button */}
            <button
              onClick={async () => {
                try {
                  // First save if there are changes
                  if (hasStructuralChanges || isDirty) {
                    await handleSave();
                  }
                  // Then publish
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api';
                  const response = await fetch(
                    `${apiUrl}/structural-components/company/${company?.id || 1}/publish`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({ createBackup: false })
                    }
                  );
                  if (response.ok) {
                    toast.success('Cambios publicados exitosamente');
                  } else {
                    toast.error('Error al publicar los cambios');
                  }
                } catch (error) {
                  console.error('Error publishing:', error);
                  toast.error('Error al publicar');
                }
              }}
              className="ml-2 px-4 py-1.5 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden relative">
        <EditorLayout deviceView={deviceView} />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <StructuralComponentsProvider>
      <EditorPageContent />
    </StructuralComponentsProvider>
  );
}