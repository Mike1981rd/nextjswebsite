'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { CustomerDetailDto, CustomerAddressDto, CustomerPaymentMethodDto } from '@/types/customer';
import { customerAPI } from '@/lib/api/customers';

interface CustomerAddressBillingTabProps {
  customer: CustomerDetailDto;
  primaryColor: string;
  onRefresh: () => void;
  isNewCustomer?: boolean;
}

export default function CustomerAddressBillingTab({ customer, primaryColor, onRefresh, isNewCustomer = false }: CustomerAddressBillingTabProps) {
  const { t } = useI18n();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddressDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNewCustomer);
  
  // For new customer - editable billing info
  const [billingInfo, setBillingInfo] = useState({
    taxId: customer.taxId || '',
    companyName: customer.companyName || '',
    preferredCurrency: customer.preferredCurrency || 'USD',
    billingCycle: 'monthly'
  });

  // For new customer - initial address
  const [newCustomerAddress, setNewCustomerAddress] = useState({
    type: 'billing',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: true
  });

  useEffect(() => {
    setBillingInfo({
      taxId: customer.taxId || '',
      companyName: customer.companyName || '',
      preferredCurrency: customer.preferredCurrency || 'USD',
      billingCycle: 'monthly'
    });
    setIsEditing(isNewCustomer);
  }, [customer, isNewCustomer]);

  const handleDeleteAddress = async (addressId: number) => {
    if (confirm(t('customers.addresses.confirmDelete', 'Are you sure you want to delete this address?'))) {
      try {
        await customerAPI.deleteAddress(customer.id, addressId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      await customerAPI.setDefaultAddress(customer.id, addressId);
      onRefresh();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: number) => {
    if (confirm(t('customers.payments.confirmDelete', 'Are you sure you want to delete this payment method?'))) {
      try {
        await customerAPI.deletePaymentMethod(customer.id, paymentMethodId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setNewCustomerAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!isNewCustomer) {
        // Update existing customer billing info
        await customerAPI.updateCustomer(customer.id, {
          taxId: billingInfo.taxId,
          companyName: billingInfo.companyName,
          preferredCurrency: billingInfo.preferredCurrency
        });
        onRefresh();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving billing info:', error);
      alert(t('common.error', 'An error occurred while saving'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 md:pb-6">
      <div className="p-4 md:p-6">
        {/* Addresses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('customers.addresses.title', 'Addresses')}
            </h3>
            {!isNewCustomer && (
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {t('customers.addresses.add', 'Add Address')}
              </button>
            )}
          </div>

          {isNewCustomer ? (
            // For new customer - show address input form
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
                    value={newCustomerAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
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
                    value={newCustomerAddress.apartment}
                    onChange={(e) => handleAddressChange('apartment', e.target.value)}
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
                    value={newCustomerAddress.city}
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
                    value={newCustomerAddress.state}
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
                    value={newCustomerAddress.postalCode}
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
                  <input
                    type="text"
                    value={newCustomerAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.countryPlaceholder', 'United States')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.label', 'Label')}
                  </label>
                  <input
                    type="text"
                    value={newCustomerAddress.label}
                    onChange={(e) => handleAddressChange('label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.addresses.labelPlaceholder', 'Home, Office, etc.')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.addresses.type', 'Type')}
                  </label>
                  <select
                    value={newCustomerAddress.type}
                    onChange={(e) => handleAddressChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                  >
                    <option value="billing">{t('customers.addresses.billing', 'Billing')}</option>
                    <option value="shipping">{t('customers.addresses.shipping', 'Shipping')}</option>
                    <option value="both">{t('customers.addresses.both', 'Both')}</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={newCustomerAddress.isDefault}
                    onChange={(e) => handleAddressChange('isDefault', e.target.checked.toString())}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: primaryColor }}
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('customers.addresses.setAsDefault', 'Set as default address')}
                  </label>
                </div>
              </div>
            </div>
          ) : (
            // For existing customer - show address cards
            <>
              {/* Mobile: Address Cards */}
              <div className="md:hidden space-y-3">
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.map((address) => (
                    <div key={address.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {address.label || address.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {address.street}
                            {address.apartment && `, ${address.apartment}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.city}{address.state && `, ${address.state}`} {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.country}
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
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium border rounded-lg"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                          >
                            {t('customers.addresses.setDefault', 'Set Default')}
                          </button>
                        )}
                        <button
                          onClick={() => setEditingAddress(address)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          {t('common.edit', 'Edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
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
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.map((address) => (
                    <div key={address.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                          {t('customers.addresses.default', 'Default')}
                        </span>
                      )}
                      
                      <div className="mb-3">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {address.label || address.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.street}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.city}{address.state && `, ${address.state}`} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.country}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {t('customers.addresses.setDefault', 'Set as Default')}
                          </button>
                        )}
                        <button
                          onClick={() => setEditingAddress(address)}
                          className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          {t('common.edit', 'Edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
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
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {t('customers.payments.add', 'Add Payment')}
              </button>
            </div>

            {/* Mobile: Payment Cards */}
            <div className="md:hidden space-y-3">
              {customer.paymentMethods && customer.paymentMethods.length > 0 ? (
                customer.paymentMethods.map((payment) => (
                  <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">💳</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {payment.cardType} •••• {payment.lastFourDigits}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('customers.payments.expires', 'Expires')} {payment.expiryMonth}/{payment.expiryYear}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {payment.cardholderName}
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
                          className="flex-1 px-3 py-1.5 text-xs font-medium border rounded-lg"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          {t('customers.payments.setDefault', 'Set Default')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(payment.id)}
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
              {customer.paymentMethods && customer.paymentMethods.length > 0 ? (
                customer.paymentMethods.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
                    {payment.isDefault && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        {t('customers.payments.default', 'Default')}
                      </span>
                    )}
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">💳</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.cardType} ending in {payment.lastFourDigits}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('customers.payments.expires', 'Expires')} {payment.expiryMonth}/{payment.expiryYear}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.cardholderName}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!payment.isDefault && (
                        <button
                          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {t('customers.payments.setDefault', 'Set as Default')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(payment.id)}
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

        {/* Billing Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t('customers.billing.title', 'Billing Information')}
              </h3>
              {!isNewCustomer && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t('common.edit', 'Edit')}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.taxId', 'Tax ID')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={billingInfo.taxId}
                    onChange={(e) => handleBillingChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.billing.taxIdPlaceholder', 'Enter tax ID')}
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {customer.taxId || t('common.notProvided', 'Not provided')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.company', 'Company')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={billingInfo.companyName}
                    onChange={(e) => handleBillingChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    placeholder={t('customers.billing.companyPlaceholder', 'Enter company name')}
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {customer.companyName || t('common.notProvided', 'Not provided')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.preferredCurrency', 'Preferred Currency')}
                </label>
                {isEditing ? (
                  <select
                    value={billingInfo.preferredCurrency}
                    onChange={(e) => handleBillingChange('preferredCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="MXN">MXN - Mexican Peso</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {customer.preferredCurrency || 'USD'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.billing.billingCycle', 'Billing Cycle')}
                </label>
                {isEditing ? (
                  <select
                    value={billingInfo.billingCycle}
                    onChange={(e) => handleBillingChange('billingCycle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor } as any}
                  >
                    <option value="monthly">{t('customers.billing.monthly', 'Monthly')}</option>
                    <option value="quarterly">{t('customers.billing.quarterly', 'Quarterly')}</option>
                    <option value="yearly">{t('customers.billing.yearly', 'Yearly')}</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 text-gray-900 dark:text-white">
                    {t('customers.billing.monthly', 'Monthly')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons - Mobile */}
      {isEditing && !isNewCustomer && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setBillingInfo({
                  taxId: customer.taxId || '',
                  companyName: customer.companyName || '',
                  preferredCurrency: customer.preferredCurrency || 'USD',
                  billingCycle: 'monthly'
                });
              }}
              className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-3 text-white rounded-lg font-medium disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Action Buttons */}
      {isEditing && !isNewCustomer && (
        <div className="hidden md:flex justify-end gap-3 mt-6 px-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setBillingInfo({
                taxId: customer.taxId || '',
                companyName: customer.companyName || '',
                preferredCurrency: customer.preferredCurrency || 'USD',
                billingCycle: 'monthly'
              });
            }}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
          </button>
        </div>
      )}
    </div>
  );
}