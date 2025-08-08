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
  
  // For editing existing addresses inline
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  
  // Temporary state for new address being added
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'billing',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  // Temporary state for new payment method being added
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardType: 'Visa',
    lastFourDigits: '',
    expiryMonth: 1,
    expiryYear: new Date().getFullYear(),
    cardholderName: '',
    isDefault: false
  });

  const handleAddressChange = (field: string, value: any, index?: number) => {
    if (index !== undefined) {
      // Editing existing address
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value
      };
      onFormChange({ addresses: updatedAddresses });
    } else {
      // For new customer primary address (first address)
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
      } else {
        const updatedAddresses = [...formData.addresses];
        updatedAddresses[0] = {
          ...updatedAddresses[0],
          [field]: value
        };
        onFormChange({ addresses: updatedAddresses });
      }
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

  const handleDeleteAddress = (index: number) => {
    if (confirm(t('customers.addresses.confirmDelete', 'Are you sure you want to delete this address?'))) {
      const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
      onFormChange({ addresses: updatedAddresses });
    }
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = formData.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    onFormChange({ addresses: updatedAddresses });
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

  const handleAddNewAddress = () => {
    const addressToAdd = {
      type: newAddress.type,
      addressLine1: newAddress.street,
      addressLine2: newAddress.apartment,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.postalCode,
      country: newAddress.country,
      isDefault: formData.addresses.length === 0 || newAddress.isDefault
    };
    
    onFormChange({ 
      addresses: [...formData.addresses, addressToAdd] 
    });
    
    // Reset form
    setNewAddress({
      type: 'billing',
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });
    setShowNewAddressForm(false);
  };

  const handleAddNewPayment = () => {
    const paymentToAdd = {
      type: newPayment.cardType.toLowerCase().replace(' ', '_'),
      last4: newPayment.lastFourDigits,
      expiryMonth: newPayment.expiryMonth,
      expiryYear: newPayment.expiryYear,
      isDefault: formData.paymentMethods.length === 0 || newPayment.isDefault
    };
    
    onFormChange({ 
      paymentMethods: [...formData.paymentMethods, paymentToAdd] 
    });
    
    // Reset form
    setNewPayment({
      cardType: 'Visa',
      lastFourDigits: '',
      expiryMonth: 1,
      expiryYear: new Date().getFullYear(),
      cardholderName: '',
      isDefault: false
    });
    setShowNewPaymentForm(false);
  };

  // Initialize first address for new customer
  if (isNewCustomer && formData.addresses.length === 0) {
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

  return (
    <div className="relative min-h-screen pb-20 md:pb-6">
      <div className="p-4 md:p-6">
        {/* Addresses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('customers.addresses.title', 'Addresses')}
            </h3>
            {!isNewCustomer && !showNewAddressForm && (
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {t('customers.addresses.add', 'Add Address')}
              </button>
            )}
          </div>

          {isNewCustomer ? (
            // For new customer - show primary address input form
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                {t('customers.addresses.primaryAddress', 'Primary Address')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.street', 'Street Address')}
                  </label>
                  <input
                    type="text"
                    value={formData.addresses[0]?.addressLine1 || ''}
                    onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.streetPlaceholder', '123 Main St')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.apartment', 'Apartment/Suite')}
                  </label>
                  <input
                    type="text"
                    value={formData.addresses[0]?.addressLine2 || ''}
                    onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.apartmentPlaceholder', 'Apt 4B')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.city', 'City')}
                  </label>
                  <input
                    type="text"
                    value={formData.addresses[0]?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.cityPlaceholder', 'New York')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.state', 'State/Province')}
                  </label>
                  <input
                    type="text"
                    value={formData.addresses[0]?.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.statePlaceholder', 'NY')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.postalCode', 'Postal Code')}
                  </label>
                  <input
                    type="text"
                    value={formData.addresses[0]?.postalCode || ''}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.postalCodePlaceholder', '10001')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.country', 'Country')}
                  </label>
                  <div className="relative">
                    <select
                      value={formData.addresses[0]?.country || ''}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all appearance-none"
                      style={{ '--tw-ring-color': primaryColor } as any}
                    >
                      <option value="">{t('customers.addresses.countryPlaceholder', 'Select Country')}</option>
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
                    {t('customers.addresses.type', 'Type')}
                  </label>
                  <select
                    value={formData.addresses[0]?.type || 'billing'}
                    onChange={(e) => handleAddressChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                  >
                    <option value="billing">{t('customers.addresses.billing', 'Billing')}</option>
                    <option value="shipping">{t('customers.addresses.shipping', 'Shipping')}</option>
                    <option value="both">{t('customers.addresses.both', 'Both')}</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            // For existing customer - show address cards
            <>
              {/* Show new address form if adding */}
              {showNewAddressForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    {t('customers.addresses.addNew', 'Add New Address')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.street', 'Street Address')}
                      </label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': primaryColor } as any}
                        placeholder={t('customers.addresses.streetPlaceholder', '123 Main St')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.apartment', 'Apartment/Suite')}
                      </label>
                      <input
                        type="text"
                        value={newAddress.apartment}
                        onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': primaryColor } as any}
                        placeholder={t('customers.addresses.apartmentPlaceholder', 'Apt 4B')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.city', 'City')}
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': primaryColor } as any}
                        placeholder={t('customers.addresses.cityPlaceholder', 'New York')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.state', 'State/Province')}
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': primaryColor } as any}
                        placeholder={t('customers.addresses.statePlaceholder', 'NY')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.postalCode', 'Postal Code')}
                      </label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': primaryColor } as any}
                        placeholder={t('customers.addresses.postalCodePlaceholder', '10001')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('customers.addresses.country', 'Country')}
                      </label>
                      <div className="relative">
                        <select
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all appearance-none"
                          style={{ '--tw-ring-color': primaryColor } as any}
                        >
                          <option value="">{t('customers.addresses.countryPlaceholder', 'Select Country')}</option>
                          {Object.entries(countries).map(([code, country]) => (
                            <option key={code} value={code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {newAddress.country && (
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <CountryFlag countryCode={newAddress.country} className="w-5 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2 flex gap-2">
                      <button
                        onClick={handleAddNewAddress}
                        className="px-4 py-2 text-white rounded-lg"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {t('common.save', 'Save')}
                      </button>
                      <button
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                      >
                        {t('common.cancel', 'Cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile: Address Cards */}
              <div className="md:hidden space-y-3">
                {formData.addresses && formData.addresses.length > 0 ? (
                  formData.addresses.map((address, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {address.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.city}{address.state && `, ${address.state}`} {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {countries[address.country as keyof typeof countries]?.name || address.country}
                          </p>
                        </div>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                            {t('customers.addresses.default', 'Default')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(index)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium border rounded-lg"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                          >
                            {t('customers.addresses.setDefault', 'Set Default')}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(index)}
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
                      {t('customers.addresses.noAddresses', 'No addresses found')}
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop: Address Grid */}
              <div className="hidden md:grid md:grid-cols-2 gap-4">
                {formData.addresses && formData.addresses.length > 0 ? (
                  formData.addresses.map((address, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                          {t('customers.addresses.default', 'Default')}
                        </span>
                      )}
                      
                      <div className="mb-3">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {address.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.city}{address.state && `, ${address.state}`} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {countries[address.country as keyof typeof countries]?.name || address.country}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(index)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {t('customers.addresses.setDefault', 'Set as Default')}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(index)}
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
                      {t('customers.addresses.noAddresses', 'No addresses found')}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Payment Methods Section - Only for existing customers */}
        {!isNewCustomer && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t('customers.payments.title', 'Payment Methods')}
              </h3>
              {!showNewPaymentForm && (
                <button
                  onClick={() => setShowNewPaymentForm(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t('customers.payments.add', 'Add Payment')}
                </button>
              )}
            </div>

            {/* Show new payment form if adding */}
            {showNewPaymentForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  {t('customers.payments.addNew', 'Add New Payment Method')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.payments.cardType', 'Card Type')}
                    </label>
                    <select
                      value={newPayment.cardType}
                      onChange={(e) => setNewPayment({...newPayment, cardType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="American Express">American Express</option>
                      <option value="Discover">Discover</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.payments.lastFour', 'Last 4 Digits')}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={newPayment.lastFourDigits}
                      onChange={(e) => setNewPayment({...newPayment, lastFourDigits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': primaryColor } as any}
                      placeholder="1234"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 flex gap-2">
                    <button
                      onClick={handleAddNewPayment}
                      className="px-4 py-2 text-white rounded-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t('common.save', 'Save')}
                    </button>
                    <button
                      onClick={() => setShowNewPaymentForm(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                    >
                      {t('common.cancel', 'Cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                    {t('customers.payments.noPayments', 'No payment methods found')}
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
                    {t('customers.payments.noPayments', 'No payment methods found')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Preferences */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.billing.preferences', 'Billing Preferences')}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.invoiceEmail', 'Invoice Email')}
                </label>
                <input
                  type="email"
                  value={formData.billingPreferences.invoiceEmail}
                  onChange={(e) => handleBillingPreferenceChange('invoiceEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder={t('customers.billing.invoiceEmailPlaceholder', 'billing@example.com')}
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
                  {t('customers.billing.autoCharge', 'Auto-charge')}
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.billing.autoChargeDescription', 'Automatically charge payment method for subscriptions')}
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
                  {t('customers.billing.paperlessBilling', 'Paperless Billing')}
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.billing.paperlessDescription', 'Receive invoices via email only')}
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