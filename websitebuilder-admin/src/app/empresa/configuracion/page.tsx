'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { StoreDetailsForm } from '@/components/empresa/StoreDetailsForm';
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
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {t('empresa.configuracion.title')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('empresa.configuracion.subtitle')}
              </p>
            </div>
          </div>
          
          {/* Save Status Indicator */}
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <Badge variant="secondary" className="animate-pulse">
                <div className="mr-2 h-2 w-2 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
                {t('common.saving')}
              </Badge>
            )}
            {saveStatus === 'saved' && (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {t('common.saved')}
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge variant="destructive">
                <AlertCircle className="mr-1 h-3 w-3" />
                {t('common.error')}
              </Badge>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li className="text-gray-500">
              {t('navigation.dashboard')}
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">
              {t('navigation.configuracion')}
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-blue-600">
              {t('navigation.empresa')}
            </li>
          </ol>
        </nav>

        <Separator className="bg-gray-200" />

        {/* Main Content Card with Modern Design */}
        <Card className="border-0 bg-white shadow-xl shadow-gray-900/5 ring-1 ring-gray-900/5">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
              <span>{t('empresa.storeDetails.title')}</span>
            </CardTitle>
            <p className="mt-2 text-sm text-gray-600">
              {t('empresa.storeDetails.description')}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <StoreDetailsForm onSaveStatusChange={handleSaveStatusChange} />
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {t('empresa.configuracion.infoTitle')}
              </p>
              <p className="text-blue-700">
                {t('empresa.configuracion.infoDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}