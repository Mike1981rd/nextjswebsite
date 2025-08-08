'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import { customerAPI } from '@/lib/api/customers';
import { CustomerDetailDto } from '@/types/customer';
import CustomerOverviewTab from './tabs/CustomerOverviewTab';
import CustomerSecurityTab from './tabs/CustomerSecurityTab';
import CustomerAddressBillingTab from './tabs/CustomerAddressBillingTab';
import CustomerNotificationsTab from './tabs/CustomerNotificationsTab';

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const isNewCustomer = customerId === 'new';

  useEffect(() => {
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#22c55e');
    }
  }, []);

  useEffect(() => {
    if (customerId === 'new') {
      // Initialize empty customer for creation
      setCustomer({
        id: 0,
        customerId: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        status: 'Active',
        accountBalance: 0,
        loyaltyPoints: 0,
        loyaltyTier: 'Silver',
        totalOrders: 0,
        totalSpent: 0,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        addresses: [],
        paymentMethods: [],
        notificationPreferences: {},
        devices: [],
        wishlistItems: [],
        coupons: [],
        orders: []
      } as CustomerDetailDto);
      setLoading(false);
    } else {
      fetchCustomerDetail();
    }
  }, [customerId]);

  const fetchCustomerDetail = async () => {
    if (customerId === 'new') return;
    
    try {
      setLoading(true);
      const data = await customerAPI.getCustomer(parseInt(customerId));
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/clientes');
  };

  const tabs = [
    { id: 'overview', label: t('customers.tabs.overview', 'Overview'), icon: '📊' },
    { id: 'security', label: t('customers.tabs.security', 'Security'), icon: '🔒' },
    { id: 'address-billing', label: t('customers.tabs.addressBilling', 'Address & Billing'), icon: '📍' },
    { id: 'notifications', label: t('customers.tabs.notifications', 'Notifications'), icon: '🔔' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  if (!customer && !isNewCustomer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t('customers.notFound', 'Customer not found')}
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {t('common.back', 'Back')}
        </button>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs - Desktop */}
          <nav className="hidden sm:flex px-4 sm:px-6 py-3 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  {t('navigation.dashboard', 'Dashboard')}
                </Link>
              </li>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li>
                <Link href="/dashboard/clientes" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  {t('navigation.clientes', 'Customers')}
                </Link>
              </li>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li className="text-gray-700 font-medium dark:text-gray-300">
                {isNewCustomer ? t('customers.newCustomer', 'New Customer') : `${customer.firstName} ${customer.lastName}`}
              </li>
            </ol>
          </nav>

          {/* Mobile Header */}
          <div className="sm:hidden px-4 py-3">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 dark:text-gray-400 mb-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('common.back', 'Back')}
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isNewCustomer ? t('customers.newCustomer', 'New Customer') : `${customer.firstName} ${customer.lastName}`}
            </h1>
          </div>

          {/* Customer Header Info */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {customer.avatarUrl ? (
                    <img src={customer.avatarUrl} alt={customer.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500 dark:text-gray-400">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </div>
                  )}
                </div>
                
                {/* Basic Info */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {isNewCustomer ? t('customers.newCustomer', 'New Customer') : `${customer.firstName} ${customer.lastName}`}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : customer.status === 'Premium'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {customer.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {customer.customerId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                  {t('customers.actions.edit', 'Edit')}
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: primaryColor }}>
                  {t('customers.actions.sendEmail', 'Send Email')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto sm:px-6 sm:py-6">
        {/* Mobile Tab Navigation - Vertical Stack Design */}
        <div className="sm:hidden">
          {/* Active Tab Header */}
          <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div 
              className="flex items-center justify-between px-4 py-3 rounded-xl text-white font-medium shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
                <span className="text-base">{tabs.find(t => t.id === activeTab)?.label}</span>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Other Tabs as Vertical List */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 space-y-2">
            {tabs.filter(tab => tab.id !== activeTab).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{tab.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tab.label}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-current text-current'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? { 
                  color: primaryColor, 
                  borderColor: primaryColor 
                } : {}}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="sm:bg-white sm:dark:bg-gray-800 sm:rounded-lg sm:shadow">
          {activeTab === 'overview' && (
            <CustomerOverviewTab 
              customer={customer} 
              primaryColor={primaryColor}
              onRefresh={fetchCustomerDetail}
              isNewCustomer={isNewCustomer}
            />
          )}
          {activeTab === 'security' && (
            <CustomerSecurityTab 
              customer={customer} 
              primaryColor={primaryColor}
              onRefresh={fetchCustomerDetail}
              isNewCustomer={isNewCustomer}
            />
          )}
          {activeTab === 'address-billing' && (
            <CustomerAddressBillingTab 
              customer={customer} 
              primaryColor={primaryColor}
              onRefresh={fetchCustomerDetail}
              isNewCustomer={isNewCustomer}
            />
          )}
          {activeTab === 'notifications' && (
            <CustomerNotificationsTab 
              customer={customer} 
              primaryColor={primaryColor}
              onRefresh={fetchCustomerDetail}
              isNewCustomer={isNewCustomer}
            />
          )}
        </div>
      </div>
    </div>
  );
}