'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';
import { 
  ShieldIcon, 
  ArrowLeftIcon, 
  SaveIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';

interface Permission {
  id: number;
  resource: string;
  action: string;
  description: string;
}

export default function NewRolePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as number[]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load everything on mount
  useEffect(() => {
    // Load UI settings
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#22c55e');
    }
    
    // Load permissions
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5266/api/permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAllPermissions(data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', 'This field is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('validation.required', 'This field is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5266/api/roles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          permissionIds: formData.permissions // Usar permissionIds como espera el backend
        })
      });

      if (response.ok) {
        router.push('/dashboard/roles-usuarios?tab=roles&success=created');
      } else {
        const errorText = await response.text();
        console.error('Error creating role:', response.status, errorText);
        
        // Try to parse error as JSON
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        } catch (e) {
          // Keep original error text if not JSON
        }
        
        alert(`Error creating role: ${errorMessage}\\n\\nStatus: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert(t('rolesUsers.createError', 'Error creating role'));
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupPermissionsByResource = () => {
    const grouped: { [key: string]: Permission[] } = {};
    allPermissions.forEach(permission => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });
    return grouped;
  };

  const handleSelectAll = (resource: string, permissions: Permission[]) => {
    const resourcePermissionIds = permissions.map(p => p.id);
    const allSelected = resourcePermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !resourcePermissionIds.includes(id))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...resourcePermissionIds])]
      }));
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 3px ${primaryColor}33`;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    e.target.style.borderColor = hasError ? '#fca5a5' : '#d1d5db';
    e.target.style.boxShadow = '';
  };

  if (loadingPermissions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  const groupedPermissions = groupPermissionsByResource();

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/roles-usuarios?tab=roles')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
                    border: `1px solid ${primaryColor}30`
                  }}
                >
                  <ShieldIcon className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('rolesUsers.createRole', 'Create Role')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('rolesUsers.defineRoleDetails', 'Define role details and permissions')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/roles-usuarios?tab=roles')}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <XIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.cancel', 'Cancel')}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.saving', 'Saving...')}</span>
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('common.create', 'Create')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('rolesUsers.basicInfo', 'Basic Information')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('rolesUsers.roleName', 'Role Name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur(e, !!errors.name)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-30 dark:bg-gray-700 dark:text-white transition-all ${
                      errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                    placeholder={t('rolesUsers.roleNamePlaceholder', 'e.g., Content Manager')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('rolesUsers.description', 'Description')} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur(e, !!errors.description)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-30 dark:bg-gray-700 dark:text-white transition-all ${
                      errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                    rows={4}
                    placeholder={t('rolesUsers.descriptionPlaceholder', 'Describe the purpose of this role')}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircleIcon className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('rolesUsers.selectedPermissions', 'Selected Permissions')}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formData.permissions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Permissions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('rolesUsers.permissions', 'Permissions')}
              </h2>

              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                  <div key={resource} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {t(`resources.${resource}`, resource)}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleSelectAll(resource, permissions)}
                          className="text-sm font-medium transition-colors"
                          style={{ 
                            color: permissions.every(p => formData.permissions.includes(p.id)) 
                              ? primaryColor 
                              : '#6b7280' 
                          }}
                        >
                          {permissions.every(p => formData.permissions.includes(p.id))
                            ? t('common.deselectAll', 'Deselect All')
                            : t('common.selectAll', 'Select All')}
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map(permission => (
                          <label
                            key={permission.id}
                            className="flex items-start gap-3 cursor-pointer group"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="sr-only"
                              />
                              <div 
                                className={`w-5 h-5 rounded border-2 transition-all ${
                                  formData.permissions.includes(permission.id)
                                    ? 'border-transparent'
                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                                }`}
                                style={{
                                  backgroundColor: formData.permissions.includes(permission.id) 
                                    ? primaryColor 
                                    : 'transparent'
                                }}
                              >
                                {formData.permissions.includes(permission.id) && (
                                  <CheckIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                {t(`permissions.${permission.action}`, permission.action)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {permission.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}