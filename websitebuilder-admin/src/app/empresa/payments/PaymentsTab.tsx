'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Check, X, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';
import { useCompany } from '@/hooks/useCompany';
import { paymentService, PaymentProvider as PaymentProviderDto } from '@/lib/api/payment.service';
// Modal removed - now using full page configuration
import { toast } from 'react-hot-toast';

interface PaymentProviderUI {
  id: number;
  providerId: string;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'configured';
  commission: string;
  accentColor: string;
  isTestMode?: boolean;
  hasCredentials?: boolean;
}

const providerMetadata: Record<string, { logo: string; accentColor: string; commission: string }> = {
  azul: {
    logo: '/payment-providers/azul.png',
    accentColor: '#0066CC',
    commission: '2.95%'
  },
  cardnet: {
    logo: '/payment-providers/cardnet.png',
    accentColor: '#E84855',
    commission: '3.25%'
  },
  portal: {
    logo: '/payment-providers/portal.png',
    accentColor: '#7C3AED',
    commission: '2.75%'
  },
  stripe: {
    logo: '/payment-providers/stripe.png',
    accentColor: '#635BFF',
    commission: '2.9% + $0.30'
  },
  paypal: {
    logo: '/payment-providers/paypal.png',
    accentColor: '#003087',
    commission: '3.49% + $0.49'
  }
};

export default function PaymentsTab() {
  const { t } = useI18n();
  const { company } = useCompany();
  const [providers, setProviders] = useState<PaymentProviderUI[]>([]);
  // Remove modal states - now using navigation
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load providers from backend
  useEffect(() => {
    loadProviders();
  }, [refreshKey]);

  // Get primary color from company or localStorage
  useEffect(() => {
    if (company?.primaryColor) {
      setPrimaryColor(company.primaryColor);
    } else {
      const settings = localStorage.getItem('ui-settings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          setPrimaryColor(parsed.primaryColor || '#22c55e');
        } catch (e) {
          console.error('Error parsing settings:', e);
        }
      }
    }
  }, [company]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getProviders();
      
      // Transform backend data to UI format
      const uiProviders: PaymentProviderUI[] = response.map(p => {
        const metadata = providerMetadata[p.provider] || {
          logo: '/payment-providers/default.png',
          accentColor: '#6B7280',
          commission: p.transactionFee + '%'
        };

        return {
          id: p.id,
          providerId: p.provider,
          name: p.name,
          logo: metadata.logo,
          status: p.isActive ? 'active' : (p.storeId || p.hasCertificate ? 'configured' : 'inactive'),
          commission: metadata.commission,
          accentColor: metadata.accentColor,
          isTestMode: p.isTestMode,
          hasCredentials: !!(p.storeId || p.hasCertificate)
        };
      });

      setProviders(uiProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error(t('payments.error.loading'));
    } finally {
      setLoading(false);
    }
  };

  const toggleProviderStatus = async (providerId: number) => {
    try {
      const result = await paymentService.toggleProvider(providerId);
      toast.success(t('payments.success.toggled'));
      setRefreshKey(prev => prev + 1); // Refresh providers
    } catch (error) {
      console.error('Error toggling provider:', error);
      toast.error(t('payments.error.toggle'));
    }
  };

  const handleConfigureProvider = (providerId: string) => {
    // Navigate to configuration page
    window.location.href = `/empresa/payments/configure/${providerId}`;
  };

  const handleDeleteProvider = async (providerId: number) => {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) {
      return;
    }

    try {
      await paymentService.deleteProvider(providerId);
      toast.success(t('payments.success.deleted'));
      setRefreshKey(prev => prev + 1); // Refresh providers
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error(t('payments.error.delete'));
    }
  };

  // handleSaveAzulConfig removed - now handled in configuration page

  if (loading && providers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 p-6 backdrop-blur-sm dark:from-violet-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('payments.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {t('payments.subtitle')}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-violet-400/10 to-pink-400/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-2xl" />
      </div>

      {/* Payment Providers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {providers.map((provider) => (
            <motion.div
              key={provider.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${provider.accentColor}40, transparent)`
                }}
              />

              {/* Card Content */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 p-5 backdrop-blur-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/80">
                {/* Status Badge */}
                <div className="absolute right-3 top-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      provider.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : provider.status === 'configured'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        provider.status === 'active' 
                          ? 'bg-green-500' 
                          : provider.status === 'configured'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    {provider.status === 'active' 
                      ? t('payments.active') 
                      : provider.status === 'configured'
                      ? t('payments.configured')
                      : t('payments.inactive')}
                  </span>
                </div>

                {/* Provider Logo */}
                <div className="mb-4 flex items-center">
                  <div className="relative h-16 w-32">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 128px, 128px"
                    />
                  </div>
                </div>

                {/* Provider Name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {provider.name}
                </h3>

                {/* Commission Rate */}
                {provider.commission && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('payments.commission')}: <span className="font-medium">{provider.commission}</span>
                  </p>
                )}

                {/* Test Mode Indicator */}
                {provider.isTestMode && provider.status !== 'inactive' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3" />
                    {t('payments.testMode')}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  {provider.status === 'inactive' && (
                    <button
                      onClick={() => handleConfigureProvider(provider.providerId)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Settings className="mr-1.5 inline h-4 w-4" />
                      {t('payments.configure.title')}
                    </button>
                  )}
                  
                  {provider.status === 'configured' && (
                    <>
                      <button
                        onClick={() => toggleProviderStatus(provider.id)}
                        className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all bg-primary-600 hover:bg-primary-700"
                      >
                        <Check className="mr-1.5 inline h-4 w-4" />
                        {t('payments.activate')}
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleConfigureProvider(provider.providerId)}
                          className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(provider.id)}
                          className="rounded-lg border border-red-300 bg-white p-2 text-red-600 transition-all hover:bg-red-50 dark:border-red-800 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                  
                  {provider.status === 'active' && (
                    <>
                      <button
                        onClick={() => toggleProviderStatus(provider.id)}
                        className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <X className="mr-1.5 inline h-4 w-4" />
                        {t('payments.deactivate')}
                      </button>
                      <button
                        onClick={() => handleConfigureProvider(provider.providerId)}
                        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Provider Card */}
        <motion.div
          layout
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative"
        >
          <button
            onClick={() => window.location.href = '/empresa/payments/add'}
            className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/50 p-8 transition-all hover:border-gray-400 hover:bg-white/80 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500 dark:hover:bg-gray-800/80"
          >
            <div className="text-center">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('payments.addProvider')}
              </p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Modals removed - now using full page configuration */}
    </div>
  );
}