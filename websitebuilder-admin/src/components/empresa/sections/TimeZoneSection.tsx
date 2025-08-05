'use client';

import { UseFormReturn } from 'react-hook-form';
import { useI18n } from '@/contexts/I18nContext';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Clock, Scale, Weight } from 'lucide-react';

interface TimeZoneSectionProps {
  form: UseFormReturn<any>;
}

export function TimeZoneSection({ form }: TimeZoneSectionProps) {
  const { t } = useI18n();
  const { formState: { errors }, setValue, watch } = form;

  const timeZones = [
    { value: '(GMT-12:00) International Date Line West', label: '(GMT-12:00) International Date Line West' },
    { value: '(GMT-11:00) Coordinated Universal Time-11', label: '(GMT-11:00) Coordinated Universal Time-11' },
    { value: '(GMT-10:00) Hawaii', label: '(GMT-10:00) Hawaii' },
    { value: '(GMT-09:00) Alaska', label: '(GMT-09:00) Alaska' },
    { value: '(GMT-08:00) Pacific Time (US & Canada)', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: '(GMT-07:00) Mountain Time (US & Canada)', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: '(GMT-06:00) Central Time (US & Canada)', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: '(GMT-05:00) Eastern Time (US & Canada)', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: '(GMT-04:00) Atlantic Time (Canada)', label: '(GMT-04:00) Atlantic Time (Canada)' },
    { value: '(GMT-04:00) Santo Domingo', label: '(GMT-04:00) Santo Domingo, República Dominicana' },
    { value: '(GMT-03:00) Buenos Aires, Georgetown', label: '(GMT-03:00) Buenos Aires, Georgetown' },
    { value: '(GMT-02:00) Coordinated Universal Time-02', label: '(GMT-02:00) Coordinated Universal Time-02' },
    { value: '(GMT-01:00) Azores', label: '(GMT-01:00) Azores' },
    { value: '(GMT+00:00) London, Dublin, Edinburgh', label: '(GMT+00:00) London, Dublin, Edinburgh' },
    { value: '(GMT+01:00) Amsterdam, Berlin, Rome', label: '(GMT+01:00) Amsterdam, Berlin, Rome' },
    { value: '(GMT+02:00) Athens, Istanbul, Minsk', label: '(GMT+02:00) Athens, Istanbul, Minsk' },
    { value: '(GMT+03:00) Kuwait, Riyadh', label: '(GMT+03:00) Kuwait, Riyadh' },
    { value: '(GMT+04:00) Abu Dhabi, Muscat', label: '(GMT+04:00) Abu Dhabi, Muscat' },
    { value: '(GMT+05:00) Islamabad, Karachi', label: '(GMT+05:00) Islamabad, Karachi' },
    { value: '(GMT+06:00) Astana, Dhaka', label: '(GMT+06:00) Astana, Dhaka' },
    { value: '(GMT+07:00) Bangkok, Hanoi, Jakarta', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
    { value: '(GMT+08:00) Beijing, Hong Kong, Singapore', label: '(GMT+08:00) Beijing, Hong Kong, Singapore' },
    { value: '(GMT+09:00) Tokyo, Seoul', label: '(GMT+09:00) Tokyo, Seoul' },
    { value: '(GMT+10:00) Canberra, Melbourne, Sydney', label: '(GMT+10:00) Canberra, Melbourne, Sydney' },
    { value: '(GMT+11:00) Coordinated Universal Time+11', label: '(GMT+11:00) Coordinated Universal Time+11' },
    { value: '(GMT+12:00) Auckland, Wellington', label: '(GMT+12:00) Auckland, Wellington' },
  ];

  const metricSystems = [
    { value: 'Metric', label: t('empresa.timeZone.metric') },
    { value: 'Imperial', label: t('empresa.timeZone.imperial') },
  ];

  const weightUnits = [
    { value: 'Kilograms', label: t('empresa.timeZone.kilograms') },
    { value: 'Pounds', label: t('empresa.timeZone.pounds') },
    { value: 'Grams', label: t('empresa.timeZone.grams') },
    { value: 'Ounces', label: t('empresa.timeZone.ounces') },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('empresa.timeZone.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('empresa.timeZone.description')}
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="space-y-8">
        {/* Time Zone - Full Width */}
        <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
          <FormField
            label={t('empresa.timeZone.timeZone')}
            error={errors.timeZone?.message}
            icon={<Clock className="h-5 w-5 text-purple-600" />}
            help={t('empresa.timeZone.timeZoneHelp')}
          >
            <Select
              value={watch('timeZone') || ''}
              onValueChange={(value) => setValue('timeZone', value)}
              placeholder={t('empresa.timeZone.selectTimeZone')}
              className="w-full"
            >
              {timeZones.map((tz) => (
                <Select.Option key={tz.value} value={tz.value}>
                  {tz.label}
                </Select.Option>
              ))}
            </Select>
          </FormField>
        </div>

        {/* Metric System & Weight Units Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
            <FormField
              label={t('empresa.timeZone.metricSystem')}
              error={errors.metricSystem?.message}
              icon={<Scale className="h-5 w-5 text-emerald-600" />}
              help={t('empresa.timeZone.metricSystemHelp')}
            >
              <Select
                value={watch('metricSystem') || 'Metric'}
                onValueChange={(value) => setValue('metricSystem', value)}
                placeholder={t('empresa.timeZone.selectMetricSystem')}
              >
                {metricSystems.map((system) => (
                  <Select.Option key={system.value} value={system.value}>
                    {system.label}
                  </Select.Option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
            <FormField
              label={t('empresa.timeZone.weightUnit')}
              error={errors.weightUnit?.message}
              icon={<Weight className="h-5 w-5 text-orange-600" />}
              help={t('empresa.timeZone.weightUnitHelp')}
            >
              <Select
                value={watch('weightUnit') || 'Kilograms'}
                onValueChange={(value) => setValue('weightUnit', value)}
                placeholder={t('empresa.timeZone.selectWeightUnit')}
              >
                {weightUnits.map((unit) => (
                  <Select.Option key={unit.value} value={unit.value}>
                    {unit.label}
                  </Select.Option>
                ))}
              </Select>
            </FormField>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start space-x-3">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">
                {t('empresa.timeZone.infoTitle')}
              </p>
              <ul className="space-y-1 text-blue-700">
                <li>• {t('empresa.timeZone.infoProduct')}</li>
                <li>• {t('empresa.timeZone.infoShipping')}</li>
                <li>• {t('empresa.timeZone.infoOrders')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-6 text-sm font-medium text-gray-500">
            {t('empresa.sections.timeZoneCompleted')}
          </span>
        </div>
      </div>
    </div>
  );
}