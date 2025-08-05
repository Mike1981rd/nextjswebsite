'use client';

import { UseFormReturn } from 'react-hook-form';
import { useI18n } from '@/contexts/I18nContext';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Building2, MapPin, Home, Hash } from 'lucide-react';

interface BillingSectionProps {
  form: UseFormReturn<any>;
}

export function BillingSection({ form }: BillingSectionProps) {
  const { t } = useI18n();
  const { register, formState: { errors }, setValue, watch } = form;

  const countries = [
    { value: 'US', label: t('countries.unitedStates') },
    { value: 'DO', label: t('countries.dominicanRepublic') },
    { value: 'MX', label: t('countries.mexico') },
    { value: 'CA', label: t('countries.canada') },
    { value: 'ES', label: t('countries.spain') },
    { value: 'FR', label: t('countries.france') },
    { value: 'DE', label: t('countries.germany') },
    { value: 'IT', label: t('countries.italy') },
    { value: 'BR', label: t('countries.brazil') },
    { value: 'AR', label: t('countries.argentina') },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('empresa.billing.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('empresa.billing.description')}
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="space-y-6">
        {/* Legal Business Name & Country Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <FormField
            label={t('empresa.billing.legalBusinessName')}
            error={errors.legalBusinessName?.message}
            icon={<Building2 className="h-5 w-5 text-gray-400" />}
          >
            <input
              {...register('legalBusinessName')}
              type="text"
              placeholder={t('empresa.billing.legalBusinessNamePlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>

          <FormField
            label={t('empresa.billing.country')}
            error={errors.country?.message}
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
          >
            <Select
              value={watch('country') || ''}
              onValueChange={(value) => setValue('country', value)}
              placeholder={t('empresa.billing.selectCountry')}
            >
              {countries.map((country) => (
                <Select.Option key={country.value} value={country.value}>
                  {country.label}
                </Select.Option>
              ))}
            </Select>
          </FormField>
        </div>

        {/* Address Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FormField
              label={t('empresa.billing.address')}
              error={errors.address?.message}
              icon={<Home className="h-5 w-5 text-gray-400" />}
            >
              <input
                {...register('address')}
                type="text"
                placeholder={t('empresa.billing.addressPlaceholder')}
                className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </FormField>
          </div>

          <FormField
            label={t('empresa.billing.apartment')}
            error={errors.apartment?.message}
            icon={<Hash className="h-5 w-5 text-gray-400" />}
          >
            <input
              {...register('apartment')}
              type="text"
              placeholder={t('empresa.billing.apartmentPlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>
        </div>

        {/* City, State, Postal Code Row */}
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            label={t('empresa.billing.city')}
            error={errors.city?.message}
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
          >
            <input
              {...register('city')}
              type="text"
              placeholder={t('empresa.billing.cityPlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>

          <FormField
            label={t('empresa.billing.state')}
            error={errors.state?.message}
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
          >
            <input
              {...register('state')}
              type="text"
              placeholder={t('empresa.billing.statePlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>

          <FormField
            label={t('empresa.billing.postalCode')}
            error={errors.postalCode?.message}
            icon={<Hash className="h-5 w-5 text-gray-400" />}
          >
            <input
              {...register('postalCode')}
              type="text"
              placeholder={t('empresa.billing.postalCodePlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>
        </div>

        {/* Region Field (Optional) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <FormField
            label={t('empresa.billing.region')}
            error={errors.region?.message}
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
            help={t('empresa.billing.regionHelp')}
          >
            <input
              {...register('region')}
              type="text"
              placeholder={t('empresa.billing.regionPlaceholder')}
              className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </FormField>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-6 text-sm font-medium text-gray-500">
            {t('empresa.sections.billingCompleted')}
          </span>
        </div>
      </div>
    </div>
  );
}