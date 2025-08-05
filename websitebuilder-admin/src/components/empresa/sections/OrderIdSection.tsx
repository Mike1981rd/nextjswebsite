'use client';

import { UseFormReturn } from 'react-hook-form';
import { useI18n } from '@/contexts/I18nContext';
import { FormField } from '@/components/ui/FormField';
import { Hash, FileText, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderIdSectionProps {
  form: UseFormReturn<any>;
}

export function OrderIdSection({ form }: OrderIdSectionProps) {
  const { t } = useI18n();
  const { register, formState: { errors }, watch } = form;
  
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  
  const prefix = watch('orderIdPrefix') || '#';
  const suffix = watch('orderIdSuffix') || '';

  // Generate preview IDs whenever prefix/suffix changes
  useEffect(() => {
    const generatePreviewIds = () => {
      const ids = [];
      for (let i = 1001; i <= 1003; i++) {
        ids.push(`${prefix}${i}${suffix}`);
      }
      setPreviewIds(ids);
    };

    generatePreviewIds();
  }, [prefix, suffix]);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
          <Hash className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('empresa.orderId.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('empresa.orderId.description')}
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prefix */}
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
            <FormField
              label={t('empresa.orderId.prefix')}
              error={errors.orderIdPrefix?.message}
              icon={<Hash className="h-5 w-5 text-indigo-600" />}
              help={t('empresa.orderId.prefixHelp')}
            >
              <input
                {...register('orderIdPrefix')}
                type="text"
                placeholder="#"
                maxLength={10}
                className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 font-mono text-lg"
              />
            </FormField>
          </div>

          {/* Suffix */}
          <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
            <FormField
              label={t('empresa.orderId.suffix')}
              error={errors.orderIdSuffix?.message}
              icon={<FileText className="h-5 w-5 text-purple-600" />}
              help={t('empresa.orderId.suffixHelp')}
            >
              <input
                {...register('orderIdSuffix')}
                type="text"
                placeholder={t('empresa.orderId.suffixPlaceholder')}
                maxLength={10}
                className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 font-mono text-lg"
              />
            </FormField>
          </div>
        </div>

        {/* Preview Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Preview Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                {t('empresa.orderId.preview')}
              </h3>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              {t('empresa.orderId.previewDescription')}
            </p>
            
            <div className="grid gap-3 sm:grid-cols-3">
              {previewIds.map((id, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-3 font-mono text-lg font-bold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100"
                >
                  {id}
                </div>
              ))}
            </div>

            {/* Format Info */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                    <Hash className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">
                    {t('empresa.orderId.formatExplanation')}
                  </p>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-16 text-blue-600 font-semibold">
                        {t('empresa.orderId.format')}:
                      </span>
                      <span className="bg-white px-2 py-1 rounded border">
                        {prefix || '[prefix]'}
                      </span>
                      <span className="text-gray-400">+</span>
                      <span className="bg-gray-100 px-2 py-1 rounded border">
                        {t('empresa.orderId.number')}
                      </span>
                      <span className="text-gray-400">+</span>
                      <span className="bg-white px-2 py-1 rounded border">
                        {suffix || '[suffix]'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            {t('empresa.orderId.bestPractices')}
          </h4>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>{t('empresa.orderId.practice1')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>{t('empresa.orderId.practice2')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>{t('empresa.orderId.practice3')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>{t('empresa.orderId.practice4')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Final Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-6 text-sm font-medium text-gray-500">
            {t('empresa.sections.orderIdCompleted')}
          </span>
        </div>
      </div>
    </div>
  );
}