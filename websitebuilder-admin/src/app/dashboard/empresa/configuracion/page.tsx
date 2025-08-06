'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { StoreDetailsForm } from '@/components/empresa/StoreDetailsForm';
import { TabsNavigation } from '@/components/empresa/TabsNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, Settings } from 'lucide-react';

export default function EmpresaConfiguracionPage() {
  const { t, language } = useI18n();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveStatusChange = (status: 'idle' | 'saving' | 'saved' | 'error') => {
    setSaveStatus(status);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-4 px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                {t('navigation.dashboard')}
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium">
              {t('navigation.empresa')}
            </li>
          </ol>
        </nav>
        
        {/* Tabs Navigation */}
        <TabsNavigation />
        
        {/* Store Details Form */}
        <div className="mt-6">
          <StoreDetailsForm onSaveStatusChange={handleSaveStatusChange} />
        </div>
      </div>
    </div>
  );
}