'use client';

import { UseFormReturn } from 'react-hook-form';
import { useI18n } from '@/contexts/I18nContext';
import { FormField } from '@/components/ui/FormField';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { User, Phone, Mail, Send, AlertTriangle } from 'lucide-react';

interface ProfileSectionProps {
  form: UseFormReturn<any>;
}

export function ProfileSection({ form }: ProfileSectionProps) {
  const { t } = useI18n();
  const { register, formState: { errors }, watch } = form;
  
  const senderEmail = watch('senderEmail');

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('empresa.profile.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('empresa.profile.description')}
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Store Name */}
        <FormField
          label={t('empresa.profile.storeName')}
          required
          error={errors.name?.message}
          icon={<User className="h-5 w-5 text-gray-400" />}
        >
          <input
            {...register('name')}
            type="text"
            placeholder={t('empresa.profile.storeNamePlaceholder')}
            className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </FormField>

        {/* Phone Number */}
        <FormField
          label={t('empresa.profile.phoneNumber')}
          error={errors.phoneNumber?.message}
          icon={<Phone className="h-5 w-5 text-gray-400" />}
        >
          <input
            {...register('phoneNumber')}
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </FormField>

        {/* Store Contact Email */}
        <FormField
          label={t('empresa.profile.contactEmail')}
          error={errors.contactEmail?.message}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        >
          <input
            {...register('contactEmail')}
            type="email"
            placeholder="contact@yourstore.com"
            className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </FormField>

        {/* Sender Email */}
        <FormField
          label={t('empresa.profile.senderEmail')}
          error={errors.senderEmail?.message}
          icon={<Send className="h-5 w-5 text-gray-400" />}
        >
          <input
            {...register('senderEmail')}
            type="email"
            placeholder="noreply@yourstore.com"
            className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </FormField>
      </div>

      {/* Sender Email Warning */}
      {senderEmail && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong className="font-semibold">
              {t('empresa.profile.senderEmailWarning.title')}
            </strong>
            <br />
            {t('empresa.profile.senderEmailWarning.description', { email: senderEmail })}
          </AlertDescription>
        </Alert>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-6 text-sm font-medium text-gray-500">
            {t('empresa.sections.profileCompleted')}
          </span>
        </div>
      </div>
    </div>
  );
}