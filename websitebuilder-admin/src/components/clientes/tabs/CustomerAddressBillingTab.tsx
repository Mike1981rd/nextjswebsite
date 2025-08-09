'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { CustomerDetailDto } from '@/types/customer';
import { AddressBillingFormData } from '../CustomerDetail';
import { CountryFlag, countries } from '@/components/ui/CountryFlag';

interface CustomerAddressBillingTabProps {
  customer: CustomerDetailDto | null;
  formData: AddressBillingFormData;
  onFormChange: (data: Partial<AddressBillingFormData>) => void;
  primaryColor: string;
  onRefresh: () => void;
  isNewCustomer?: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export default function CustomerAddressBillingTab({ 
  customer, 
  formData,
  onFormChange,
  primaryColor, 
  onRefresh, 
  isNewCustomer = false,
  isEditing,
  setIsEditing
}: CustomerAddressBillingTabProps) {
  const { t } = useI18n();
  
  const handleAddressChange = (field: string, value: any) => {
    // Always update the first address (primary address)
    if (formData.addresses.length === 0) {
      // Create new address with the field being changed
      onFormChange({ 
        addresses: [{
          type: 'billing',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          isDefault: true,
          [field]: value  // Include the field being changed
        }]
      });
    } else {
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[0] = {
        ...updatedAddresses[0],
        [field]: value
      };
      onFormChange({ addresses: updatedAddresses });
    }
  };

  const handleBillingPreferenceChange = (field: string, value: any) => {
    onFormChange({
      billingPreferences: {
        ...formData.billingPreferences,
        [field]: value
      }
    });
  };

  const handleDeletePaymentMethod = (index: number) => {
    if (confirm(t('customers.payments.confirmDelete', 'Are you sure you want to delete this payment method?'))) {
      const updatedPayments = formData.paymentMethods.filter((_, i) => i !== index);
      onFormChange({ paymentMethods: updatedPayments });
    }
  };

  const handleSetDefaultPayment = (index: number) => {
    const updatedPayments = formData.paymentMethods.map((payment, i) => ({
      ...payment,
      isDefault: i === index
    }));
    onFormChange({ paymentMethods: updatedPayments });
  };

  // Initialize first address for new customer - use useEffect to avoid setState during render
  React.useEffect(() => {
    if (formData.addresses.length === 0) {
      onFormChange({ 
        addresses: [{
          type: 'billing',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          isDefault: true
        }]
      });
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="relative min-h-screen pb-20 md:pb-6">
      <div className="p-4 md:p-6">
        {/* Addresses Section - Always show form like in CreateCliente */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.addresses.title', 'Direcciones')}
          </h3>
          
          {/* Main form container */}
          <div className="space-y-4">
            {/* Dirección Principal section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('customers.addresses.mainAddress', 'Dirección Principal')}
              </h4>
              
              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.streetLabel', 'Dirección de Calle')}
                  </label>
                  <input
                    type="text"
                    maxLength={255}
                    value={formData.addresses[0]?.addressLine1 || ''}
                    onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.streetPlaceholder', 'Calle Principal 123')}
                  />
                </div>
                
                {/* Two column grid for Apartment/Suite and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.apartment', 'Apartamento/Suite')}
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.addresses[0]?.addressLine2 || ''}
                      onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                      placeholder={t('customers.addresses.apartmentPlaceholder', 'Depto 4B')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.city', 'Ciudad')}
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.addresses[0]?.city || ''}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                      placeholder={t('customers.addresses.cityPlaceholder', 'Ciudad de México')}
                    />
                  </div>
                </div>
                
                {/* Two column grid for State and Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.state', 'Estado/Provincia')}
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.addresses[0]?.state || ''}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                      placeholder={t('customers.addresses.statePlaceholder', 'CDMX')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.postalCode', 'Código Postal')}
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={formData.addresses[0]?.postalCode || ''}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                      placeholder={t('customers.addresses.postalCodePlaceholder', '01000')}
                    />
                  </div>
                </div>
                
                {/* Two column grid for Country and Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.country', 'País')}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.addresses[0]?.country || ''}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all appearance-none"
                        style={{ '--tw-ring-color': primaryColor } as any}
                      >
                        <option value="">{t('customers.addresses.countryPlaceholder', 'Seleccionar País')}</option>
                        {Object.entries(countries).map(([code, country]) => (
                          <option key={code} value={code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {formData.addresses[0]?.country && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <CountryFlag countryCode={formData.addresses[0].country} className="w-5 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.addresses.type', 'Tipo')}
                    </label>
                    <select
                      value={formData.addresses[0]?.type || 'billing'}
                      onChange={(e) => handleAddressChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                    >
                      <option value="billing">{t('customers.addresses.billing', 'Facturación')}</option>
                      <option value="shipping">{t('customers.addresses.shipping', 'Envío')}</option>
                      <option value="both">{t('customers.addresses.both', 'Ambos')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section - Only for existing customers */}
        {!isNewCustomer && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.payments.title', 'Métodos de Pago')}
            </h3>

            {/* Mobile: Payment Cards */}
            <div className="md:hidden space-y-3">
              {formData.paymentMethods && formData.paymentMethods.length > 0 ? (
                formData.paymentMethods.map((payment, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">💳</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            •••• {payment.last4}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('customers.payments.expires', 'Expires')} {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                        </div>
                      </div>
                      {payment.isDefault && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                          {t('customers.payments.default', 'Default')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {!payment.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(index)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium border rounded-lg"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          {t('customers.payments.setDefault', 'Set Default')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(index)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg"
                      >
                        {t('common.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.payments.noPayments', 'No se encontraron métodos de pago')}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop: Payment Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {formData.paymentMethods && formData.paymentMethods.length > 0 ? (
                formData.paymentMethods.map((payment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                    {payment.isDefault && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        {t('customers.payments.default', 'Default')}
                      </span>
                    )}
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">💳</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ending in {payment.last4}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('customers.payments.expires', 'Expires')} {payment.expiryMonth}/{payment.expiryYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!payment.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(index)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {t('customers.payments.setDefault', 'Set as Default')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(index)}
                        className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {t('common.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.payments.noPayments', 'No se encontraron métodos de pago')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Preferences */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.billing.preferences', 'Preferencias de Facturación')}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.invoiceEmail', 'Correo de Facturación')}
                </label>
                <input
                  type="email"
                  value={formData.billingPreferences.invoiceEmail}
                  onChange={(e) => handleBillingPreferenceChange('invoiceEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder={t('customers.billing.invoiceEmailPlaceholder', 'facturacion@ejemplo.com')}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.billingPreferences.autoCharge}
                  onChange={(e) => handleBillingPreferenceChange('autoCharge', e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('customers.billing.autoCharge', 'Cargo Automático')}
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.billing.autoChargeDescription', 'Cargar automáticamente el método de pago para suscripciones')}
                  </span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.billingPreferences.paperlessBilling}
                  onChange={(e) => handleBillingPreferenceChange('paperlessBilling', e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('customers.billing.paperlessBilling', 'Facturación sin Papel')}
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.billing.paperlessDescription', 'Recibir facturas solo por correo electrónico')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}