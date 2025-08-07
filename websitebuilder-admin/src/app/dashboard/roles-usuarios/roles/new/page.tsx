'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';
import { 
  ShieldIcon, 
  ArrowLeftIcon, 
  SaveIcon,
  XIcon,
  CheckIcon
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

  useEffect(() => {
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#22c55e');
    }
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
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/dashboard/roles-usuarios?tab=roles&success=created');
      } else {
        const error = await response.text();
        console.error('Error saving role:', error);
        alert(t('rolesUsers.saveError', 'Error saving role'));
      }
    } catch (error) {
      console.error('Error saving role:', error);
      alert(t('rolesUsers.saveError', 'Error saving role'));
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
                    {t('rolesUsers.createNewRole', 'Create New Role')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('rolesUsers.definePermissions', 'Define role name and permissions')}
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
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.saving', 'Saving...')}</span>
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('common.save', 'Save Role')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('rolesUsers.basicInformation', 'Basic Information')}
              </h2>

              {/* Role Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rolesUsers.roleName', 'Role Name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, !!errors.name)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all ${
                    errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('rolesUsers.roleNamePlaceholder', 'e.g., Sales Manager')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rolesUsers.roleDescription', 'Description')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={(e) => handleInputBlur(e, !!errors.description)}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all resize-none ${
                    errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('rolesUsers.roleDescriptionPlaceholder', 'Describe the purpose of this role')}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Role Info Card */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {t('rolesUsers.roleInfoTitle', 'About Roles')}
                    </h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      {t('rolesUsers.roleInfoDescription', 'Roles define what users can access and modify in the system. Assign permissions carefully.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Permissions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('rolesUsers.permissions', 'Permissions')}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.permissions.length} {t('rolesUsers.selected', 'selected')}
                </span>
              </div>

              {loadingPermissions ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([resource, permissions]) => {
                    const allSelected = permissions.every(p => formData.permissions.includes(p.id));
                    const someSelected = permissions.some(p => formData.permissions.includes(p.id));

                    return (
                      <div key={resource} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {t(`permissions.resources.${resource}`, resource)}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                              {permissions.filter(p => formData.permissions.includes(p.id)).length}/{permissions.length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(resource, permissions)}
                            className="text-sm font-medium transition-colors"
                            style={{ color: primaryColor }}
                          >
                            {allSelected ? t('common.deselectAll', 'Deselect All') : t('common.selectAll', 'Select All')}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {permissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.permissions.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                                    formData.permissions.includes(permission.id)
                                      ? 'border-transparent'
                                      : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500'
                                  }`}
                                  style={{
                                    backgroundColor: formData.permissions.includes(permission.id) ? primaryColor : 'transparent'
                                  }}
                                >
                                  {formData.permissions.includes(permission.id) && (
                                    <CheckIcon className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                {t(`permissions.actions.${permission.action}`, permission.action)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}