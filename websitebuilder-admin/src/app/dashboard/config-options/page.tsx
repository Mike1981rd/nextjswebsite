'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/contexts/ToastContext';
import IconPicker from '@/components/ui/IconPicker';
import Toggle from '@/components/ui/Toggle';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  HomeIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface ConfigOption {
  id: number;
  type: string;
  value: string;
  labelEs: string;
  labelEn: string;
  icon?: string;
  iconType?: string;
  category?: string;
  sortOrder: number;
  usageCount: number;
  isActive: boolean;
  isCustom: boolean;
  isDefault: boolean;
}

export default function ConfigOptionsPage() {
  const { t, language } = useI18n();
  const { showToast } = useToast() as any;
  
  const [options, setOptions] = useState<ConfigOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<ConfigOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('amenity');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState<ConfigOption | null>(null);
  const [formData, setFormData] = useState({
    type: 'amenity',
    value: '',
    labelEs: '',
    labelEn: '',
    icon: '',
    iconType: 'heroicon',
    category: '',
    sortOrder: 999,
    isActive: true
  });

  const optionTypes = [
    { value: 'amenity', label: t('config.types.amenity', 'Amenidades'), icon: SparklesIcon },
    { value: 'room_type', label: t('config.types.roomType', 'Tipos de Habitación'), icon: HomeIcon },
    { value: 'view_type', label: t('config.types.viewType', 'Tipos de Vista'), icon: EyeIcon },
    { value: 'policy_type', label: t('config.types.policyType', 'Tipos de Política'), icon: Cog6ToothIcon }
  ];

  const categories = {
    amenity: ['básicas', 'premium', 'exterior', 'tecnología', 'servicios'],
    room_type: ['estándar', 'premium', 'lujo'],
    view_type: ['natural', 'urbana', 'interior'],
    policy_type: ['flexible', 'moderada', 'estricta']
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    filterOptions();
  }, [options, activeTab, searchTerm]);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Si no hay opciones, inicializar las por defecto
          await initializeDefaults();
          return;
        }
        throw new Error('Error al cargar opciones');
      }

      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error:', error);
      showToast(t('common.error', 'Error al cargar las opciones'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions/initialize-defaults`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast(t('config.defaultsInitialized', 'Opciones por defecto inicializadas'), 'success');
        fetchOptions();
      }
    } catch (error) {
      console.error('Error inicializando defaults:', error);
    }
  };

  const filterOptions = () => {
    let filtered = options.filter(opt => opt.type === activeTab);
    
    if (searchTerm) {
      filtered = filtered.filter(opt => 
        opt.labelEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.labelEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOptions(filtered);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingOption 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions/${editingOption.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions`;

      const method = editingOption ? 'PUT' : 'POST';
      
      const body = editingOption ? {
        labelEs: formData.labelEs,
        labelEn: formData.labelEn,
        icon: formData.icon,
        iconType: formData.iconType,
        category: formData.category,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive
      } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      showToast(
        editingOption 
          ? t('config.updated', 'Opción actualizada exitosamente')
          : t('config.created', 'Opción creada exitosamente'),
        'success'
      );

      setShowModal(false);
      resetForm();
      fetchOptions();
    } catch (error: any) {
      showToast(error.message || t('common.error', 'Error al guardar'), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('config.confirmDelete', '¿Está seguro de eliminar esta opción?'))) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      showToast(t('config.deleted', 'Opción eliminada exitosamente'), 'success');
      fetchOptions();
    } catch (error: any) {
      showToast(error.message || t('common.error', 'Error al eliminar'), 'error');
    }
  };

  const handleToggleActive = async (option: ConfigOption) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ConfigOptions/${option.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !option.isActive })
      });

      if (response.ok) {
        fetchOptions();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const openEditModal = (option: ConfigOption) => {
    setEditingOption(option);
    setFormData({
      type: option.type,
      value: option.value,
      labelEs: option.labelEs,
      labelEn: option.labelEn,
      icon: option.icon || '',
      iconType: option.iconType || 'heroicon',
      category: option.category || '',
      sortOrder: option.sortOrder,
      isActive: option.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingOption(null);
    setFormData({
      type: activeTab,
      value: '',
      labelEs: '',
      labelEn: '',
      icon: '',
      iconType: 'heroicon',
      category: '',
      sortOrder: 999,
      isActive: true
    });
  };

  const renderIcon = (option: ConfigOption) => {
    if (!option.icon) return null;

    if (option.iconType === 'emoji' || option.icon.length <= 3) {
      return <span className="text-xl">{option.icon}</span>;
    }

    // Para heroicons, por ahora mostrar un icono genérico
    return <SparklesIcon className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('config.title', 'Gestión de Catálogos')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('config.description', 'Personaliza las opciones disponibles en tu sistema')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {optionTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setActiveTab(type.value)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === type.value
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {type.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search', 'Buscar...')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={() => {
            resetForm();
            setFormData(prev => ({ ...prev, type: activeTab }));
            setShowModal(true);
          }}
          className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {t('config.addOption', 'Agregar Opción')}
        </button>
      </div>

      {/* Options Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.icon', 'Icono')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.label', 'Etiqueta')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.value', 'Valor')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.category', 'Categoría')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.usage', 'Uso')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('config.status', 'Estado')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('common.actions', 'Acciones')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOptions.map(option => (
              <tr key={option.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {renderIcon(option)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {language === 'es' ? option.labelEs : option.labelEn}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'es' ? option.labelEn : option.labelEs}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {option.value}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {option.category && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {option.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {option.usageCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Toggle
                    checked={option.isActive}
                    onChange={() => handleToggleActive(option)}
                    size="small"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(option)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {option.isCustom && (
                      <button
                        onClick={() => handleDelete(option.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('config.noOptions', 'No se encontraron opciones')}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingOption 
                ? t('config.editOption', 'Editar Opción')
                : t('config.addOption', 'Agregar Opción')}
            </h2>

            <div className="space-y-4">
              {!editingOption && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('config.type', 'Tipo')}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      {optionTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('config.value', 'Valor')} *
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="wifi, pool, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('config.labelEs', 'Etiqueta en Español')} *
                </label>
                <input
                  type="text"
                  value={formData.labelEs}
                  onChange={(e) => setFormData({ ...formData, labelEs: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('config.labelEn', 'Etiqueta en Inglés')} *
                </label>
                <input
                  type="text"
                  value={formData.labelEn}
                  onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('config.icon', 'Icono')}
                </label>
                <IconPicker
                  value={formData.icon}
                  onChange={(icon, type) => setFormData({ ...formData, icon, iconType: type })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('config.category', 'Categoría')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('common.select', 'Seleccionar')}</option>
                  {categories[formData.type as keyof typeof categories]?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('config.sortOrder', 'Orden')}
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <Toggle
                  checked={formData.isActive}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label={t('config.active', 'Activo')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('common.save', 'Guardar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}