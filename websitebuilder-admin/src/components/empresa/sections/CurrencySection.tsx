'use client';

import { UseFormReturn } from 'react-hook-form';
import { useI18n } from '@/contexts/I18nContext';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { DollarSign, TrendingUp, Globe } from 'lucide-react';

interface CurrencySectionProps {
  form: UseFormReturn<any>;
}

export function CurrencySection({ form }: CurrencySectionProps) {
  const { t } = useI18n();
  const { formState: { errors }, setValue, watch } = form;

  const selectedCurrency = watch('currency');

  const currencies = [
    { 
      value: 'USD', 
      label: 'USD - US Dollar', 
      symbol: '$',
      popular: true 
    },
    { 
      value: 'DOP', 
      label: 'DOP - Dominican Peso', 
      symbol: 'RD$',
      popular: true 
    },
    { 
      value: 'EUR', 
      label: 'EUR - Euro', 
      symbol: '€',
      popular: true 
    },
    { 
      value: 'GBP', 
      label: 'GBP - British Pound', 
      symbol: '£',
      popular: true 
    },
    { 
      value: 'CAD', 
      label: 'CAD - Canadian Dollar', 
      symbol: 'C$',
      popular: true 
    },
    { 
      value: 'MXN', 
      label: 'MXN - Mexican Peso', 
      symbol: '$',
      popular: true 
    },
    { 
      value: 'JPY', 
      label: 'JPY - Japanese Yen', 
      symbol: '¥',
      popular: false 
    },
    { 
      value: 'AUD', 
      label: 'AUD - Australian Dollar', 
      symbol: 'A$',
      popular: false 
    },
    { 
      value: 'CHF', 
      label: 'CHF - Swiss Franc', 
      symbol: 'CHF',
      popular: false 
    },
    { 
      value: 'CNY', 
      label: 'CNY - Chinese Yuan', 
      symbol: '¥',
      popular: false 
    },
    { 
      value: 'BRL', 
      label: 'BRL - Brazilian Real', 
      symbol: 'R$',
      popular: false 
    },
    { 
      value: 'ARS', 
      label: 'ARS - Argentine Peso', 
      symbol: '$',
      popular: false 
    },
    { 
      value: 'COP', 
      label: 'COP - Colombian Peso', 
      symbol: '$',
      popular: false 
    },
    { 
      value: 'PEN', 
      label: 'PEN - Peruvian Sol', 
      symbol: 'S/',
      popular: false 
    },
    { 
      value: 'CLP', 
      label: 'CLP - Chilean Peso', 
      symbol: '$',
      popular: false 
    },
  ];

  // Separate popular and other currencies
  const popularCurrencies = currencies.filter(c => c.popular);
  const otherCurrencies = currencies.filter(c => !c.popular);

  const getSelectedCurrencyInfo = () => {
    return currencies.find(c => c.value === selectedCurrency);
  };

  const currencyInfo = getSelectedCurrencyInfo();

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('empresa.currency.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('empresa.currency.description')}
          </p>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-8">
        <FormField
          label={t('empresa.currency.storeCurrency')}
          error={errors.currency?.message}
          icon={<Globe className="h-5 w-5 text-green-600" />}
          help={t('empresa.currency.storeCurrencyHelp')}
        >
          <Select
            value={selectedCurrency || 'USD'}
            onValueChange={(value) => setValue('currency', value)}
            placeholder={t('empresa.currency.selectCurrency')}
            className="w-full"
          >
            {/* Popular Currencies Group */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              {t('empresa.currency.popularCurrencies')}
            </div>
            {popularCurrencies.map((currency) => (
              <Select.Option key={currency.value} value={currency.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{currency.label}</span>
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {currency.symbol}
                  </span>
                </div>
              </Select.Option>
            ))}
            
            {/* Other Currencies Group */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
              {t('empresa.currency.otherCurrencies')}
            </div>
            {otherCurrencies.map((currency) => (
              <Select.Option key={currency.value} value={currency.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{currency.label}</span>
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {currency.symbol}
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </FormField>

        {/* Currency Preview */}
        {currencyInfo && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 font-bold">
                  {currencyInfo.symbol}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {currencyInfo.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('empresa.currency.selectedCurrency')}
                  </p>
                </div>
              </div>
              
              {/* Sample pricing display */}
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">
                  {t('empresa.currency.priceExample')}:
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currencyInfo.symbol}99.99
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Currency Info Alert */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong className="font-semibold">
            {t('empresa.currency.importantNote')}
          </strong>
          <br />
          <div className="mt-2 space-y-1 text-blue-700">
            <p>• {t('empresa.currency.noteProducts')}</p>
            <p>• {t('empresa.currency.notePayments')}</p>
            <p>• {t('empresa.currency.noteReports')}</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-6 text-sm font-medium text-gray-500">
            {t('empresa.sections.currencyCompleted')}
          </span>
        </div>
      </div>
    </div>
  );
}