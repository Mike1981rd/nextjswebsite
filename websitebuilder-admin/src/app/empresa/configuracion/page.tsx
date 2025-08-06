'use client';

import { useI18n } from '@/contexts/I18nContext';
import { StoreDetailsForm } from '@/components/empresa/StoreDetailsForm';
import { TabsNavigation } from '@/components/empresa/TabsNavigation';

export default function EmpresaConfiguracionPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              {t('navigation.dashboard')}
            </a>
          </li>
          <li className="text-gray-400 dark:text-gray-500">/</li>
          <li>
            <a href="/configuracion" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              {t('navigation.configuracion')}
            </a>
          </li>
          <li className="text-gray-400 dark:text-gray-500">/</li>
          <li className="text-gray-700 font-medium dark:text-gray-300">
            {t('navigation.empresa')}
          </li>
        </ol>
      </nav>
      
      {/* Tabs Navigation */}
      <TabsNavigation />
      
      {/* Store Details Form */}
      <div className="mt-6">
        <StoreDetailsForm />
      </div>
    </div>
  );
}