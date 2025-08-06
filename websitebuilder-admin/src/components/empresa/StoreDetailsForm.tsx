'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useCompany } from '@/hooks/useCompany';
import { Loader2, AlertCircle } from 'lucide-react';
import { CountryFlag, countries, currencies } from '@/components/ui/CountryFlag';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { LogoUploader } from './LogoUploader';
import { api } from '@/lib/api';

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

export function StoreDetailsForm() {
  const { t } = useI18n();
  const { company, updateCompany, isLoading, error, refetch } = useCompany();
  const [isSaving, setIsSaving] = useState(false);
  const [logo, setLogo] = useState<string>('');
  const [logoSize, setLogoSize] = useState<number>(120);
  const [showLogoSuccess, setShowLogoSuccess] = useState(false);
  
  // Get primary color from localStorage (set by ThemeCustomizer)
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  
  useEffect(() => {
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        setPrimaryColor(parsed.primaryColor || '#22c55e');
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StoreDetailsFormData>({
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
      timeZone: 'America/Santo_Domingo',
      metricSystem: 'Metric',
      weightUnit: 'Kilograms',
      currency: 'USD',
      orderIdPrefix: '#',
      orderIdSuffix: '',
    },
  });

  // Watch for order ID changes
  const orderIdPrefix = watch('orderIdPrefix');
  const orderIdSuffix = watch('orderIdSuffix');

  // Load company data
  useEffect(() => {
    if (company) {
      // Set logo with proper URL handling
      if (company.logo) {
        setLogo(company.logo);
      }
      setLogoSize(company.logoSize || 120);
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
        timeZone: company.timeZone || 'America/Santo_Domingo',
        metricSystem: company.metricSystem || 'Metric',
        weightUnit: company.weightUnit || 'Kilograms',
        currency: company.currency || 'USD',
        orderIdPrefix: company.orderIdPrefix || '#',
        orderIdSuffix: company.orderIdSuffix || '',
      });
    }
  }, [company, reset]);

  const handleLogoChange = async (newLogoUrl: string) => {
    setLogo(newLogoUrl);
    // Auto-save logo usando endpoint específico
    try {
      await api.put('/company/current/logo', { logo: newLogoUrl });
      // Actualizar el company en el hook para reflejar el cambio
      await refetch();
      
      // Mostrar notificación de éxito
      setShowLogoSuccess(true);
      setTimeout(() => setShowLogoSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating logo:', error);
    }
  };

  const handleLogoSizeChange = async (newSize: number) => {
    setLogoSize(newSize);
    // Auto-save logo size
    try {
      await api.put('/company/current/logo-size', { size: newSize });
    } catch (error) {
      console.error('Error updating logo size:', error);
    }
  };

  const onSubmit = async (data: StoreDetailsFormData) => {
    try {
      setIsSaving(true);
      
      // Limpiar campos vacíos antes de enviar
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      console.log('Sending data:', cleanedData);
      await updateCompany(cleanedData);
      
      // Mostrar mensaje de éxito (puedes agregar un toast aquí)
      console.log('Company updated successfully');
    } catch (error: any) {
      console.error('Error saving company:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  // Input styles with primary color focus and dark mode support
  const inputClassName = `w-[68%] sm:w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 text-ellipsis`;
  const inputFocusStyle = {
    '--tw-ring-color': primaryColor,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-0 overflow-hidden">
      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pl-4 pr-6 py-4 sm:p-6 border-b dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">{t('empresa.profile.title', 'Profile')}</h2>
        
        {/* Logo Upload Section */}
        <div className="mb-6 relative">
          <LogoUploader
            currentLogo={logo}
            currentSize={logoSize}
            onLogoChange={handleLogoChange}
            onSizeChange={handleLogoSizeChange}
          />
          
          {/* Success notification */}
          {showLogoSuccess && (
            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Logo guardado exitosamente
            </div>
          )}
        </div>
        
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="w-full">
            <input
              {...register('name')}
              placeholder={t('empresa.profile.storeName', 'Store Name')}
              className={inputClassName}
              style={inputFocusStyle}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <input
              {...register('phoneNumber')}
              placeholder={t('empresa.profile.phoneNumber', 'Phone Number')}
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
          <div className="w-full">
            <input
              {...register('contactEmail')}
              placeholder={t('empresa.profile.contactEmail', 'Store contact email')}
              className={inputClassName}
              style={inputFocusStyle}
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
            )}
          </div>
          <div className="w-full">
            <input
              {...register('senderEmail')}
              placeholder={t('empresa.profile.senderEmail', 'Sender email')}
              className={inputClassName}
              style={inputFocusStyle}
            />
            {errors.senderEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.senderEmail.message}</p>
            )}
          </div>
        </div>
        
        {/* Warning message */}
        <div className="w-[68%] sm:w-full mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded flex items-start">
          <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</span>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            {t('empresa.profile.emailWarning', 'Confirm that you have access to johndoe@gmail.com in sender email settings.')}
          </span>
        </div>
      </motion.div>

      {/* Billing Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="pl-4 pr-6 py-4 sm:p-6 border-b dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">{t('empresa.billing.title', 'Billing Information')}</h2>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="w-full">
            <input
              {...register('legalBusinessName')}
              placeholder={t('empresa.billing.legalName', 'Legal business name')}
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
          <div className="w-full">
            <Select.Root value={watch('country') || ''} onValueChange={(value) => { 
              setValue('country', value, { shouldDirty: true });
            }}>
              <Select.Trigger
                className={`${inputClassName} flex items-center justify-between overflow-hidden`}
                style={inputFocusStyle}
              >
                <Select.Value>
                  {watch('country') ? (
                    <div className="flex items-center gap-2">
                      <CountryFlag code={countries[watch('country') as keyof typeof countries].flag} />
                      <span>{t(`countries.${watch('country')}`, countries[watch('country') as keyof typeof countries].name)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">{t('empresa.billing.countryPlaceholder', 'Country/region')}</span>
                  )}
                </Select.Value>
                <Select.Icon>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Select.Icon>
              </Select.Trigger>
              
              <Select.Portal>
                <Select.Content className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
                  <Select.Viewport>
                    <Select.Group>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('countries.northAmerica', 'North America')}</Select.Label>
                      {Object.entries(countries)
                        .filter(([code]) => ['US', 'CA', 'MX'].includes(code))
                        .map(([code, country]) => (
                          <Select.Item
                            key={code}
                            value={code}
                            className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                          >
                            <CountryFlag code={country.flag} />
                            <Select.ItemText>{t(`countries.${code}`, country.name)}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4" style={{ color: primaryColor }} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Group>
                    
                    <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    
                    <Select.Group>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('countries.caribbean', 'Caribbean')}</Select.Label>
                      {Object.entries(countries)
                        .filter(([code]) => ['DO', 'PR', 'CU', 'JM', 'HT', 'TT', 'BB'].includes(code))
                        .map(([code, country]) => (
                          <Select.Item
                            key={code}
                            value={code}
                            className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                          >
                            <CountryFlag code={country.flag} />
                            <Select.ItemText>{t(`countries.${code}`, country.name)}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4" style={{ color: primaryColor }} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Group>
                    
                    <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    
                    <Select.Group>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('countries.centralAmerica', 'Central America')}</Select.Label>
                      {Object.entries(countries)
                        .filter(([code]) => ['GT', 'SV', 'HN', 'NI', 'CR', 'PA', 'BZ'].includes(code))
                        .map(([code, country]) => (
                          <Select.Item
                            key={code}
                            value={code}
                            className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                          >
                            <CountryFlag code={country.flag} />
                            <Select.ItemText>{t(`countries.${code}`, country.name)}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4" style={{ color: primaryColor }} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Group>
                    
                    <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    
                    <Select.Group>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('countries.southAmerica', 'South America')}</Select.Label>
                      {Object.entries(countries)
                        .filter(([code]) => ['AR', 'BR', 'CL', 'CO', 'EC', 'PY', 'PE', 'UY', 'VE', 'BO', 'GY', 'SR', 'GF'].includes(code))
                        .map(([code, country]) => (
                          <Select.Item
                            key={code}
                            value={code}
                            className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                          >
                            <CountryFlag code={country.flag} />
                            <Select.ItemText>{t(`countries.${code}`, country.name)}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4" style={{ color: primaryColor }} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Group>
                    
                    <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    
                    <Select.Group>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('countries.europe', 'Europe')}</Select.Label>
                      {Object.entries(countries)
                        .filter(([code]) => ['ES', 'FR', 'DE', 'IT', 'PT', 'GB'].includes(code))
                        .map(([code, country]) => (
                          <Select.Item
                            key={code}
                            value={code}
                            className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                          >
                            <CountryFlag code={country.flag} />
                            <Select.ItemText>{t(`countries.${code}`, country.name)}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <Check className="h-4 w-4" style={{ color: primaryColor }} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="w-full">
            <input
              {...register('address')}
              placeholder={t('empresa.billing.address', 'Address')}
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
          <div className="w-full">
            <input
              {...register('apartment')}
              placeholder={t('empresa.billing.apartment', 'Apartment, suite, etc.')}
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-2 col-span-1 sm:col-span-2">
            <input
              {...register('city')}
              placeholder={t('empresa.billing.city', 'City')}
              className={inputClassName}
              style={inputFocusStyle}
            />
            <input
              {...register('state')}
              placeholder={t('empresa.billing.state', 'State')}
              className={inputClassName}
              style={inputFocusStyle}
            />
            <input
              {...register('postalCode')}
              placeholder={t('empresa.billing.postalCode', 'PIN Code')}
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
        </div>
      </motion.div>

      {/* Time zone and units */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="pl-4 pr-6 py-4 sm:p-6 border-b dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">{t('empresa.timeZone.title', 'Time zone and units of measurement')}</h2>
        <p className="w-[68%] sm:w-full text-sm text-gray-600 dark:text-gray-400 mb-4">{t('empresa.timeZone.description', 'Used to calculate product prices, shipping weights, and order times.')}</p>
        
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="w-full">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.timeZone.label', 'Time Zone')}</label>
            <select
              {...register('timeZone')}
              className={inputClassName}
              style={inputFocusStyle}
            >
              <option value="America/Santo_Domingo">(GMT-04:00) Santo Domingo</option>
              <option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
              <option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
              <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
              <option value="America/Mexico_City">(GMT-06:00) Mexico City</option>
              <option value="America/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
              <option value="America/Sao_Paulo">(GMT-03:00) São Paulo</option>
              <option value="America/Bogota">(GMT-05:00) Bogotá</option>
              <option value="America/Lima">(GMT-05:00) Lima</option>
              <option value="America/Santiago">(GMT-03:00) Santiago</option>
            </select>
          </div>
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
            <div className="w-full">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.timeZone.metric', 'Metric')}</label>
              <select
                {...register('metricSystem')}
                className={inputClassName}
                style={inputFocusStyle}
              >
                <option value="Metric">{t('empresa.timeZone.metricOption', 'Metric')}</option>
                <option value="Imperial">{t('empresa.timeZone.imperialOption', 'Imperial')}</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.timeZone.weight', 'Weight')}</label>
              <select
                {...register('weightUnit')}
                className={inputClassName}
                style={inputFocusStyle}
              >
                <option value="Kilograms">{t('empresa.timeZone.kilograms', 'Kilograms')}</option>
                <option value="Pounds">{t('empresa.timeZone.pounds', 'Pounds')}</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Store currency */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="pl-4 pr-6 py-4 sm:p-6 border-b dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">{t('empresa.currency.title', 'Store currency')}</h2>
        <p className="w-[68%] sm:w-full text-sm text-gray-600 dark:text-gray-400 mb-4">{t('empresa.currency.description', 'The currency your products are sold in.')}</p>
        
        <div className="max-w-sm">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.currency.label', 'Store currency')}</label>
          <Select.Root value={watch('currency') || 'USD'} onValueChange={(value) => {
            setValue('currency', value, { shouldDirty: true });
          }}>
            <Select.Trigger
              className={`${inputClassName} flex items-center justify-between`}
              style={inputFocusStyle}
            >
              <Select.Value>
                {watch('currency') && currencies[watch('currency') as keyof typeof currencies] ? (
                  <span>{watch('currency')} - {currencies[watch('currency') as keyof typeof currencies].name}</span>
                ) : (
                  <span className="text-gray-500">{t('empresa.currency.placeholder', 'Select currency')}</span>
                )}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
                <Select.Viewport>
                  <Select.Group>
                    <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('currencies.northAmerica', 'North America')}</Select.Label>
                    {Object.entries(currencies)
                      .filter(([code]) => ['USD', 'CAD', 'MXN'].includes(code))
                      .map(([code, currency]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{code} - {currency.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-4 w-4" style={{ color: primaryColor }} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                  </Select.Group>
                  
                  <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <Select.Group>
                    <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('currencies.caribbean', 'Caribbean')}</Select.Label>
                    {Object.entries(currencies)
                      .filter(([code]) => ['DOP', 'CUP', 'JMD', 'HTG', 'TTD', 'BBD'].includes(code))
                      .map(([code, currency]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{code} - {currency.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-4 w-4" style={{ color: primaryColor }} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                  </Select.Group>
                  
                  <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <Select.Group>
                    <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('currencies.centralAmerica', 'Central America')}</Select.Label>
                    {Object.entries(currencies)
                      .filter(([code]) => ['GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'BZD'].includes(code))
                      .map(([code, currency]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{code} - {currency.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-4 w-4" style={{ color: primaryColor }} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                  </Select.Group>
                  
                  <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <Select.Group>
                    <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('currencies.southAmerica', 'South America')}</Select.Label>
                    {Object.entries(currencies)
                      .filter(([code]) => ['ARS', 'BRL', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'VES', 'GYD', 'SRD'].includes(code))
                      .map(([code, currency]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{code} - {currency.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-4 w-4" style={{ color: primaryColor }} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                  </Select.Group>
                  
                  <Select.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <Select.Group>
                    <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('currencies.europe', 'Europe')}</Select.Label>
                    {Object.entries(currencies)
                      .filter(([code]) => ['EUR', 'GBP'].includes(code))
                      .map(([code, currency]) => (
                        <Select.Item
                          key={code}
                          value={code}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{code} - {currency.name}</Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <Check className="h-4 w-4" style={{ color: primaryColor }} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </motion.div>

      {/* Order ID format */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="pl-4 pr-6 py-4 sm:p-6 border-b dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold mb-4 dark:text-white">{t('empresa.orderId.title', 'Order id format')}</h2>
        <p className="w-[68%] sm:w-full text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('empresa.orderId.description', 'Shown on the Orders page, customer pages, and customer order notifications to identify orders.')}
        </p>
        
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mb-4">
          <div className="w-full">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.orderId.prefix', 'Prefix')}</label>
            <input
              {...register('orderIdPrefix')}
              placeholder="#"
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('empresa.orderId.suffix', 'Suffix')}</label>
            <input
              {...register('orderIdSuffix')}
              placeholder=""
              className={inputClassName}
              style={inputFocusStyle}
            />
          </div>
        </div>
        
        <p className="w-[68%] sm:w-full text-sm text-gray-600 dark:text-gray-400">
          {t('empresa.orderId.preview', 'Your order ID will appear as')} {orderIdPrefix || '#'}1001, {orderIdPrefix || '#'}1002, {orderIdPrefix || '#'}1003 ...
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="pl-4 pr-6 py-4 sm:p-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={() => reset()}
          className="w-[68%] sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 rounded transition-colors"
        >
          {t('common.discard', 'Discard')}
        </button>
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="w-[68%] sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          style={{ 
            backgroundColor: primaryColor,
            opacity: !isDirty || isSaving ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (isDirty && !isSaving) {
              e.currentTarget.style.filter = 'brightness(90%)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(100%)';
          }}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.saving', 'Saving...')}
            </>
          ) : (
            t('common.saveChanges', 'Save Changes')
          )}
        </button>
      </motion.div>
    </form>
  );
}