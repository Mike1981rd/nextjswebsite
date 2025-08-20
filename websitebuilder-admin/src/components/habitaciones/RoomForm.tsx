'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/contexts/ToastContext';
import RoomFormExtended from './RoomFormExtended';
import Toggle from '@/components/ui/Toggle';
import { 
  XMarkIcon, 
  PlusIcon,
  PhotoIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

interface RoomFormData {
  name: string;
  description?: string;
  basePrice: number;
  comparePrice?: number;
  maxOccupancy: number;
  roomCode?: string;
  roomType?: string;
  floorNumber?: number;
  viewType?: string;
  squareMeters?: number;
  
  // NUEVOS - Ubicación
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  
  // NUEVO - Host
  hostId?: number;
  
  // NUEVOS - Configuraciones JSON
  sleepingArrangements?: any;
  houseRules?: any;
  cancellationPolicy?: any;
  checkInInstructions?: any;
  safetyFeatures?: any;
  highlightFeatures?: any;
  additionalFees?: any;
  
  // NUEVOS - SEO
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  
  tags?: string[];
  amenities?: string[];
  images?: string[];
  isActive: boolean;
}

interface RoomFormProps {
  initialData?: RoomFormData;
  onSave: (data: RoomFormData) => Promise<void>;
  onCancel: () => void;
  primaryColor: string;
}

export default function RoomForm({
  initialData,
  onSave,
  onCancel,
  primaryColor
}: RoomFormProps) {
  const { t } = useI18n();
  const { showToast } = useToast() as any;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'features' | 'media'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    basePrice: 0,
    comparePrice: undefined,
    maxOccupancy: 2,
    roomCode: '',
    roomType: '', // Ensure this is never null
    floorNumber: undefined,
    viewType: '', // Ensure this is never null
    squareMeters: undefined,
    // NUEVOS campos inicializados
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: undefined,
    longitude: undefined,
    neighborhood: '',
    hostId: undefined,
    sleepingArrangements: {},
    houseRules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      smokingAllowed: false,
      petsAllowed: false,
      eventsAllowed: false,
      quietHours: '22:00 - 08:00',
      additionalRules: []
    },
    cancellationPolicy: {
      type: 'flexible',
      description: '',
      fullRefundDays: 1,
      partialRefundPercent: 50
    },
    checkInInstructions: {},
    safetyFeatures: {},
    highlightFeatures: {},
    additionalFees: {
      cleaningFee: 0,
      serviceFee: 0,
      securityDeposit: 0,
      petFee: 0,
      extraGuestFee: 0,
      extraGuestAfter: 2,
      weeklyDiscount: 0,
      monthlyDiscount: 0
    },
    slug: '',
    metaTitle: '',
    metaDescription: '',
    tags: [],
    amenities: [],
    images: [],
    isActive: true,
    ...initialData,
    // Ensure select values are never null
    roomType: initialData?.roomType || '',
    viewType: initialData?.viewType || ''
  });

  const [newTag, setNewTag] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceDisplay, setPriceDisplay] = useState(formatCurrency(formData.basePrice));
  const [comparePriceDisplay, setComparePriceDisplay] = useState(formData.comparePrice ? formatCurrency(formData.comparePrice) : '');

  // Format number as currency
  function formatCurrency(value: number | string): string {
    if (!value || value === 0) return '';
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  // Parse currency string to number
  function parseCurrency(value: string): number {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  // Initialize currency displays
  useEffect(() => {
    if (formData.basePrice > 0) {
      setPriceDisplay(formatCurrency(formData.basePrice));
    }
    if (formData.comparePrice && formData.comparePrice > 0) {
      setComparePriceDisplay(formatCurrency(formData.comparePrice));
    }
  }, []);

  // Room types predefinidos
  const roomTypes = [
    { value: 'standard', label: t('rooms.types.standard', 'Estándar') },
    { value: 'deluxe', label: t('rooms.types.deluxe', 'Deluxe') },
    { value: 'suite', label: t('rooms.types.suite', 'Suite') },
    { value: 'junior-suite', label: t('rooms.types.juniorSuite', 'Junior Suite') },
    { value: 'presidential', label: t('rooms.types.presidential', 'Presidencial') },
    { value: 'penthouse', label: t('rooms.types.penthouse', 'Penthouse') }
  ];

  // View types predefinidos
  const viewTypes = [
    { value: 'sea', label: t('rooms.views.sea', 'Vista al Mar') },
    { value: 'city', label: t('rooms.views.city', 'Vista a la Ciudad') },
    { value: 'garden', label: t('rooms.views.garden', 'Vista al Jardín') },
    { value: 'pool', label: t('rooms.views.pool', 'Vista a la Piscina') },
    { value: 'mountain', label: t('rooms.views.mountain', 'Vista a la Montaña') },
    { value: 'interior', label: t('rooms.views.interior', 'Vista Interior') }
  ];

  // Amenidades predefinidas - usando keys que serán traducidas en el render
  const commonAmenities = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'tv', label: 'TV' },
    { key: 'minibar', label: 'Minibar' },
    { key: 'ac', label: 'Aire Acondicionado' },
    { key: 'heating', label: 'Calefacción' },
    { key: 'safe', label: 'Caja Fuerte' },
    { key: 'balcony', label: 'Balcón' },
    { key: 'terrace', label: 'Terraza' },
    { key: 'jacuzzi', label: 'Jacuzzi' },
    { key: 'seaview', label: 'Vista al Mar' },
    { key: 'kitchen', label: 'Cocina' },
    { key: 'microwave', label: 'Microondas' },
    { key: 'coffee', label: 'Cafetera' },
    { key: 'hairdryer', label: 'Secador de Pelo' },
    { key: 'iron', label: 'Plancha' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', 'Este campo es obligatorio');
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = t('validation.minPrice', 'El precio debe ser mayor a 0');
    }

    if (formData.maxOccupancy < 1 || formData.maxOccupancy > 20) {
      newErrors.maxOccupancy = t('validation.occupancy', 'La ocupación debe estar entre 1 y 20');
    }

    if (formData.comparePrice && formData.comparePrice <= formData.basePrice) {
      newErrors.comparePrice = t('validation.comparePrice', 'El precio de comparación debe ser mayor al precio base');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(t('validation.fixErrors', 'Por favor corrija los errores en el formulario'), 'error');
      
      // Cambiar a la pestaña que tiene el primer error
      if (errors.name || errors.basePrice) {
        setActiveTab('general');
      } else if (errors.comparePrice) {
        setActiveTab('pricing');
      } else if (errors.maxOccupancy) {
        setActiveTab('features');
      }
      
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      // El mensaje de éxito se maneja en la página padre
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error instanceof Error) {
        // Intentar parsear el error como JSON si viene del backend
        try {
          const errorData = JSON.parse(error.message);
          
          if (errorData.validationErrors) {
            // Mostrar errores de validación específicos
            const firstError = Object.values(errorData.validationErrors)[0];
            if (Array.isArray(firstError)) {
              showToast(firstError[0] as string, 'error');
            }
          } else {
            showToast(errorData.error || error.message, 'error');
          }
        } catch {
          // Si no es JSON, mostrar el mensaje tal cual
          showToast(error.message, 'error');
        }
      } else {
        showToast(t('common.error', 'Ocurrió un error inesperado'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities?.filter(a => a !== amenity)
    });
  };

  // Handle image file upload
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        showToast(t('validation.invalidImageType', 'Por favor seleccione solo archivos de imagen'), 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl && !formData.images?.includes(dataUrl)) {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), dataUrl]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Handle image reordering via drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...(formData.images || [])];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged image from its original position
    newImages.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    setFormData({ ...formData, images: newImages });
    setDraggedIndex(null);
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index)
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (!formData.images) return;
    
    const newImages = [...formData.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setFormData({ ...formData, images: newImages });
    }
  };

  // Input helper functions
  const getInputClassName = (hasError: boolean) => {
    return `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-30 dark:bg-gray-700 dark:text-white transition-all ${
      hasError 
        ? 'border-red-300 dark:border-red-600' 
        : 'border-gray-300 dark:border-gray-600'
    }`;
  };

  const getInputStyle = () => ({
    '--tw-ring-color': primaryColor,
  } as React.CSSProperties);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 3px ${primaryColor}33`;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, hasError: boolean) => {
    e.target.style.borderColor = hasError ? '#fca5a5' : '#d1d5db';
    e.target.style.boxShadow = '';
  };

  const tabs = [
    { id: 'general', label: t('rooms.tabs.general', 'Información General'), icon: '🏠' },
    { id: 'pricing', label: t('rooms.tabs.pricing', 'Precios'), icon: '💰' },
    { id: 'features', label: t('rooms.tabs.features', 'Características'), icon: '✨' },
    { id: 'media', label: t('rooms.tabs.media', 'Imágenes'), icon: '📷' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs - Mobile */}
      <div className="sm:hidden">
        <div className="px-4 py-3 bg-white dark:bg-gray-800">
          <div 
            className="px-4 py-3 rounded-xl text-white" 
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
              <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-2 space-y-2">
          {tabs.filter(tab => tab.id !== activeTab).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{tab.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{tab.label}</span>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="hidden sm:block border-b dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              style={activeTab === tab.id ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      <div className="p-4 sm:p-6">
        {/* Tab General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.name', 'Nombre')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={getInputClassName(!!errors.name)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, !!errors.name)}
                  placeholder={t('rooms.namePlaceholder', 'Ej: Suite Presidencial')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.code', 'Código')}
                </label>
                <input
                  type="text"
                  value={formData.roomCode}
                  onChange={(e) => setFormData({ ...formData, roomCode: e.target.value })}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                  placeholder={t('rooms.codePlaceholder', 'Ej: SUITE-101')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.description', 'Descripción')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={getInputClassName(false)}
                style={getInputStyle()}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, false)}
                rows={4}
                placeholder={t('rooms.descriptionPlaceholder', 'Describe las características de la habitación...')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.type', 'Tipo de Habitación')}
                </label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                >
                  <option value="">{t('common.select', 'Seleccionar')}</option>
                  {roomTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.viewType', 'Tipo de Vista')}
                </label>
                <select
                  value={formData.viewType}
                  onChange={(e) => setFormData({ ...formData, viewType: e.target.value })}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                >
                  <option value="">{t('common.select', 'Seleccionar')}</option>
                  {viewTypes.map(view => (
                    <option key={view.value} value={view.value}>
                      {view.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Toggle
                checked={formData.isActive}
                onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                label={t('rooms.activeRoom', 'Habitación activa')}
                size="medium"
              />
            </div>
          </div>
        )}

        {/* Tab Precios */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.basePrice', 'Precio Base')} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => {
                      const input = e.target.value;
                      // Allow typing numbers and formatting
                      const cleanValue = input.replace(/[^0-9.]/g, '');
                      const parts = cleanValue.split('.');
                      if (parts.length > 2) return; // Don't allow multiple decimals
                      if (parts[1] && parts[1].length > 2) return; // Max 2 decimal places
                      
                      setPriceDisplay(input);
                      const numValue = parseCurrency(input);
                      setFormData({ ...formData, basePrice: numValue });
                    }}
                    onBlur={(e) => {
                      const numValue = parseCurrency(priceDisplay);
                      setPriceDisplay(formatCurrency(numValue));
                      setFormData({ ...formData, basePrice: numValue });
                      handleInputBlur(e, !!errors.basePrice);
                    }}
                    className={`pl-8 ${getInputClassName(!!errors.basePrice)}`}
                    style={getInputStyle()}
                    onFocus={(e) => {
                      handleInputFocus(e);
                      // Select all text on focus for easy editing
                      e.target.select();
                    }}
                    placeholder="0.00"
                  />
                </div>
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.basePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.comparePrice', 'Precio de Comparación')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={comparePriceDisplay}
                    onChange={(e) => {
                      const input = e.target.value;
                      // Allow typing numbers and formatting
                      const cleanValue = input.replace(/[^0-9.]/g, '');
                      const parts = cleanValue.split('.');
                      if (parts.length > 2) return; // Don't allow multiple decimals
                      if (parts[1] && parts[1].length > 2) return; // Max 2 decimal places
                      
                      setComparePriceDisplay(input);
                      const numValue = parseCurrency(input);
                      setFormData({ ...formData, comparePrice: numValue || undefined });
                    }}
                    onBlur={(e) => {
                      const numValue = parseCurrency(comparePriceDisplay);
                      setComparePriceDisplay(numValue ? formatCurrency(numValue) : '');
                      setFormData({ ...formData, comparePrice: numValue || undefined });
                      handleInputBlur(e, !!errors.comparePrice);
                    }}
                    className={`pl-8 ${getInputClassName(!!errors.comparePrice)}`}
                    style={getInputStyle()}
                    onFocus={(e) => {
                      handleInputFocus(e);
                      // Select all text on focus for easy editing
                      e.target.select();
                    }}
                    placeholder="0.00"
                  />
                </div>
                {errors.comparePrice && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.comparePrice}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('rooms.comparePriceHelp', 'Se mostrará tachado para indicar descuento')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Características */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.maxOccupancy', 'Ocupación Máxima')} *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) || 1 })}
                  className={getInputClassName(!!errors.maxOccupancy)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, !!errors.maxOccupancy)}
                />
                {errors.maxOccupancy && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxOccupancy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.floor', 'Piso')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={formData.floorNumber || ''}
                  onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.squareMeters', 'Metros Cuadrados')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.squareMeters || ''}
                  onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                />
              </div>
            </div>

            {/* Amenidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.amenitiesLabel', 'Amenidades')}
              </label>
              
              {/* Amenidades predefinidas */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {t('rooms.quickAdd', 'Agregar rápido')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map(amenity => {
                    // Obtener la traducción correcta para amenidades que tienen traducción
                    const amenityLabel = ['wifi', 'tv', 'minibar', 'jacuzzi'].includes(amenity.key) 
                      ? amenity.label 
                      : t(`rooms.amenities.${amenity.key}`, amenity.label);
                    
                    return (
                      <button
                        key={amenity.key}
                        type="button"
                        onClick={() => {
                          if (!formData.amenities?.includes(amenityLabel)) {
                            setFormData({
                              ...formData,
                              amenities: [...(formData.amenities || []), amenityLabel]
                            });
                          }
                        }}
                        disabled={formData.amenities?.includes(amenityLabel)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          formData.amenities?.includes(amenityLabel)
                            ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {amenityLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                  placeholder={t('rooms.addAmenity', 'Agregar amenidad personalizada')}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>

              {formData.amenities && formData.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.tags', 'Etiquetas')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className={getInputClassName(false)}
                  style={getInputStyle()}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, false)}
                  placeholder={t('rooms.addTag', 'Agregar etiqueta')}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-gray-600 dark:hover:text-gray-400"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Imágenes */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.images', 'Imágenes')}
              </label>
              
              {/* File upload area with drag and drop */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                
                <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('rooms.dragDropImages', 'Arrastra y suelta imágenes aquí, o')}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t('rooms.selectImages', 'Seleccionar Imágenes')}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('rooms.imageFormats', 'PNG, JPG, GIF hasta 10MB')}
                </p>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {t('rooms.dragToReorder', 'Arrastra las imágenes para reordenarlas')}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-move"
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, index)}
                        onDragOver={handleImageDragOver}
                        onDrop={(e) => handleImageDrop(e, index)}
                      >
                        <img
                          src={image}
                          alt={`${t('rooms.image', 'Imagen')} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              className="p-1 bg-white dark:bg-gray-800 rounded shadow"
                            >
                              <ArrowUpIcon className="h-4 w-4" />
                            </button>
                          )}
                          {index < (formData.images?.length || 0) - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              className="p-1 bg-white dark:bg-gray-800 rounded shadow"
                            >
                              <ArrowDownIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-500 text-white rounded shadow"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded">
                            {t('rooms.mainImage', 'Principal')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Extended Fields - New tabs for location, policies, fees, SEO */}
      <RoomFormExtended 
        formData={formData}
        setFormData={setFormData}
        primaryColor={primaryColor}
      />

      {/* Botones de acción */}
      <div className="px-4 sm:px-6 py-4 border-t dark:border-gray-700 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {t('common.cancel', 'Cancelar')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          style={{ backgroundColor: loading ? '#9ca3af' : primaryColor }}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading 
            ? t('common.saving', 'Guardando...') 
            : (initialData ? t('common.update', 'Actualizar') : t('common.create', 'Crear'))
          }
        </button>
      </div>
    </form>
  );
}