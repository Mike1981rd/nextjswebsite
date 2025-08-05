'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useI18n } from '@/contexts/I18nContext';
import { useCompany } from '@/hooks/useCompany';
import { ProfileSection } from './sections/ProfileSection';
import { BillingSection } from './sections/BillingSection';
import { TimeZoneSection } from './sections/TimeZoneSection';
import { CurrencySection } from './sections/CurrencySection';
import { OrderIdSection } from './sections/OrderIdSection';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Save, Loader2 } from 'lucide-react';

// Validation Schema
const storeDetailsSchema = z.object({
  name: z.string().min(1).max(255),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")),
  
  // Profile Section
  phoneNumber: z.string().max(20).optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  senderEmail: z.string().email().optional().or(z.literal("")),
  
  // Billing Information
  legalBusinessName: z.string().max(255).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  region: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
  apartment: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(100).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  
  // Time Zone & Units
  timeZone: z.string().max(100).optional().or(z.literal("")),
  metricSystem: z.string().max(20).optional().or(z.literal("")),
  weightUnit: z.string().max(20).optional().or(z.literal("")),
  
  // Currency
  currency: z.string().length(3).optional().or(z.literal("")),
  
  // Order ID Format
  orderIdPrefix: z.string().max(10).optional().or(z.literal("")),
  orderIdSuffix: z.string().max(10).optional().or(z.literal("")),
});

type StoreDetailsFormData = z.infer<typeof storeDetailsSchema>;

interface StoreDetailsFormProps {
  onSaveStatusChange: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
}

export function StoreDetailsForm({ onSaveStatusChange }: StoreDetailsFormProps) {
  const { t } = useI18n();
  const { company, updateCompany, isLoading, error } = useCompany();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const form = useForm<StoreDetailsFormData>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      name: '',
      primaryColor: '#22c55e',
      secondaryColor: '#64748b',
      phoneNumber: '',
      contactEmail: '',
      senderEmail: '',
      legalBusinessName: '',
      country: '',
      region: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      timeZone: '',
      metricSystem: 'Metric',
      weightUnit: 'Kilograms',
      currency: 'USD',
      orderIdPrefix: '#',
      orderIdSuffix: '',
    },
  });

  const { watch, handleSubmit, reset, formState: { errors, isDirty } } = form;

  // Load company data when available
  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        primaryColor: company.primaryColor || '#22c55e',
        secondaryColor: company.secondaryColor || '#64748b',
        phoneNumber: company.phoneNumber || '',
        contactEmail: company.contactEmail || '',
        senderEmail: company.senderEmail || '',
        legalBusinessName: company.legalBusinessName || '',
        country: company.country || '',
        region: company.region || '',
        address: company.address || '',
        apartment: company.apartment || '',
        city: company.city || '',
        state: company.state || '',
        postalCode: company.postalCode || '',
        timeZone: company.timeZone || '',
        metricSystem: company.metricSystem || 'Metric',
        weightUnit: company.weightUnit || 'Kilograms',
        currency: company.currency || 'USD',
        orderIdPrefix: company.orderIdPrefix || '#',
        orderIdSuffix: company.orderIdSuffix || '',
      });
    }
  }, [company, reset]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || !company) return;

    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        const timeoutId = setTimeout(() => {
          handleSubmit(onSubmit)();
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, isDirty, autoSaveEnabled, company]);

  const onSubmit = async (data: StoreDetailsFormData) => {
    try {
      onSaveStatusChange('saving');
      await updateCompany(data);
      setLastSaved(new Date());
      onSaveStatusChange('saved');
      
      // Reset saved status after 3 seconds
      setTimeout(() => {
        onSaveStatusChange('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving company:', error);
      onSaveStatusChange('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        onSaveStatusChange('idle');
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <h3 className="font-medium text-red-800">{t('common.error')}</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Profile Section */}
      <ProfileSection form={form} />

      {/* Billing Information Section */}
      <BillingSection form={form} />

      {/* Time Zone & Units Section */}
      <TimeZoneSection form={form} />

      {/* Store Currency Section */}
      <CurrencySection form={form} />

      {/* Order ID Format Section */}
      <OrderIdSection form={form} />

      {/* Save Section */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoSave" className="text-sm font-medium text-gray-700">
              {t('empresa.form.autoSave')}
            </label>
          </div>
          {lastSaved && (
            <span className="text-xs text-gray-500">
              {t('empresa.form.lastSaved')}: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={!isDirty || isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-8 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.saving')}...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('common.saveChanges')}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}