'use client';

import { useI18n } from '@/contexts/I18nContext';
import { StoreDetailsForm } from '@/components/empresa/StoreDetailsForm';
import { TabsNavigation } from '@/components/empresa/TabsNavigation';

export default function EmpresaConfiguracionPage() {
  const { t } = useI18n();

  return (
    <div className="h-full bg-gray-50 pt-16"> {/* Added pt-16 to avoid navbar overlap */}
      <div className="max-w-6xl mx-auto py-4 px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/dashboard" className="text-gray-500 hover:text-gray-700">
                {t('navigation.dashboard')}
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <a href="/configuracion" className="text-gray-500 hover:text-gray-700">
                {t('navigation.configuracion')}
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">
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
    </div>
  );
}