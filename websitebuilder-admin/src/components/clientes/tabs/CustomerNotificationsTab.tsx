'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { CustomerDetailDto } from '@/types/customer';
import { customerAPI } from '@/lib/api/customers';

interface CustomerNotificationsTabProps {
  customer: CustomerDetailDto;
  primaryColor: string;
  onRefresh: () => void;
  isNewCustomer?: boolean;
}

export default function CustomerNotificationsTab({ customer, primaryColor, onRefresh, isNewCustomer = false }: CustomerNotificationsTabProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize preferences with defaults for new customer
  const getDefaultPreferences = () => ({
    email: {
      marketing: false,
      orderUpdates: true,
      newsletter: false,
      security: true
    },
    browser: {
      marketing: false,
      orderUpdates: true,
      newsletter: false,
      security: true
    },
    app: {
      marketing: false,
      orderUpdates: true,
      newsletter: false,
      security: true
    }
  });

  const [preferences, setPreferences] = useState(
    isNewCustomer 
      ? getDefaultPreferences()
      : {
          email: customer.notificationPreferences?.email || getDefaultPreferences().email,
          browser: customer.notificationPreferences?.browser || getDefaultPreferences().browser,
          app: customer.notificationPreferences?.app || getDefaultPreferences().app
        }
  );

  // Contact preferences
  const [contactPreferences, setContactPreferences] = useState({
    preferredMethod: customer.preferredContactMethod || 'email',
    bestTimeToContact: 'morning'
  });

  useEffect(() => {
    if (!isNewCustomer && customer.notificationPreferences) {
      setPreferences({
        email: customer.notificationPreferences.email || getDefaultPreferences().email,
        browser: customer.notificationPreferences.browser || getDefaultPreferences().browser,
        app: customer.notificationPreferences.app || getDefaultPreferences().app
      });
    }
  }, [customer, isNewCustomer]);

  const handleToggle = (channel: 'email' | 'browser' | 'app', type: string) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type]
      }
    }));
    setHasChanges(true);
  };

  const handleContactPreferenceChange = (field: string, value: string) => {
    setContactPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSavePreferences = async () => {
    if (!hasChanges) return;
    
    try {
      setLoading(true);
      
      if (!isNewCustomer) {
        await customerAPI.updateNotificationPreferences(customer.id, preferences);
        onRefresh();
        alert(t('customers.notifications.saved', 'Notification preferences saved'));
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert(t('customers.notifications.error', 'Error saving preferences'));
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'marketing',
      label: t('customers.notifications.marketing', 'Marketing & Promotions'),
      description: t('customers.notifications.marketingDesc', 'Receive updates about new products and special offers')
    },
    {
      key: 'orderUpdates',
      label: t('customers.notifications.orderUpdates', 'Order Updates'),
      description: t('customers.notifications.orderUpdatesDesc', 'Get notified about order status changes and shipping')
    },
    {
      key: 'newsletter',
      label: t('customers.notifications.newsletter', 'Newsletter'),
      description: t('customers.notifications.newsletterDesc', 'Weekly digest with tips and updates')
    },
    {
      key: 'security',
      label: t('customers.notifications.security', 'Security Alerts'),
      description: t('customers.notifications.securityDesc', 'Important notifications about account security')
    }
  ];

  const channels = [
    { key: 'email', label: t('customers.notifications.email', 'Email'), icon: '✉️' },
    { key: 'browser', label: t('customers.notifications.browser', 'Browser'), icon: '🌐' },
    { key: 'app', label: t('customers.notifications.app', 'Mobile App'), icon: '📱' }
  ];

  return (
    <div className="relative min-h-screen pb-20 md:pb-6">
      <div className="p-4 md:p-6">
        {/* Notification Settings Grid */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.notifications.preferences', 'Notification Preferences')}
          </h3>
          
          {/* Mobile: Vertical Layout */}
          <div className="md:hidden space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {type.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <div
                      key={channel.key}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{channel.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {channel.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(channel.key as any, type.key)}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                          preferences[channel.key as keyof typeof preferences][type.key]
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{
                          backgroundColor: preferences[channel.key as keyof typeof preferences][type.key] 
                            ? primaryColor 
                            : undefined,
                          marginRight: '0px'
                        }}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            preferences[channel.key as keyof typeof preferences][type.key]
                              ? 'translate-x-5'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:block space-y-6">
            {notificationTypes.map((type) => (
              <div key={type.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {channels.map((channel) => (
                    <label
                      key={channel.key}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{channel.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {channel.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle(channel.key as any, type.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[channel.key as keyof typeof preferences][type.key]
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{
                          backgroundColor: preferences[channel.key as keyof typeof preferences][type.key] 
                            ? primaryColor 
                            : undefined
                        }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[channel.key as keyof typeof preferences][type.key]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.notifications.contactPreferences', 'Contact Preferences')}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.notifications.preferredContact', 'Preferred Contact Method')}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  value={contactPreferences.preferredMethod}
                  onChange={(e) => handleContactPreferenceChange('preferredMethod', e.target.value)}
                >
                  <option value="email">{t('customers.notifications.email', 'Email')}</option>
                  <option value="phone">{t('customers.notifications.phone', 'Phone')}</option>
                  <option value="sms">{t('customers.notifications.sms', 'SMS')}</option>
                  <option value="whatsapp">{t('customers.notifications.whatsapp', 'WhatsApp')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.notifications.contactTime', 'Best Time to Contact')}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  value={contactPreferences.bestTimeToContact}
                  onChange={(e) => handleContactPreferenceChange('bestTimeToContact', e.target.value)}
                >
                  <option value="morning">{t('customers.notifications.morning', 'Morning (9AM-12PM)')}</option>
                  <option value="afternoon">{t('customers.notifications.afternoon', 'Afternoon (12PM-5PM)')}</option>
                  <option value="evening">{t('customers.notifications.evening', 'Evening (5PM-8PM)')}</option>
                  <option value="anytime">{t('customers.notifications.anytime', 'Anytime')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings for New Customer */}
        {isNewCustomer && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.notifications.initialSettings', 'Initial Communication Settings')}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.notifications.welcomeEmail', 'Send Welcome Email')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('customers.notifications.welcomeEmailDesc', 'Send a welcome email with account details')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded mt-0.5"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.notifications.confirmEmail', 'Require Email Confirmation')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('customers.notifications.confirmEmailDesc', 'Customer must verify email before accessing account')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded mt-0.5"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.notifications.marketingOptIn', 'Marketing Opt-In')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('customers.notifications.marketingOptInDesc', 'Pre-select marketing communications')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded mt-0.5"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication History - Only for existing customers */}
        {!isNewCustomer && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.notifications.communicationHistory', 'Communication History')}
            </h3>
            
            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
              {customer.communicationHistory && customer.communicationHistory.length > 0 ? (
                customer.communicationHistory.slice(0, 5).map((comm, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{comm.type === 'email' ? '✉️' : comm.type === 'sms' ? '📱' : '🔔'}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {comm.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comm.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        comm.status === 'delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : comm.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {t(`customers.notifications.${comm.status}`, comm.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.notifications.noHistory', 'No communication history')}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('customers.notifications.date', 'Date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('customers.notifications.type', 'Type')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('customers.notifications.subject', 'Subject')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('customers.notifications.status', 'Status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                    {customer.communicationHistory && customer.communicationHistory.length > 0 ? (
                      customer.communicationHistory.slice(0, 5).map((comm, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(comm.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center space-x-1">
                              <span>{comm.type === 'email' ? '✉️' : comm.type === 'sms' ? '📱' : '🔔'}</span>
                              <span>{comm.type}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {comm.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              comm.status === 'delivered' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : comm.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {t(`customers.notifications.${comm.status}`, comm.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          {t('customers.notifications.noHistory', 'No communication history')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Note for new customers */}
        {isNewCustomer && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-medium">{t('common.note', 'Note')}:</span> {t('customers.notifications.newCustomerNote', 'Notification preferences will be saved when the customer is created.')}
            </p>
          </div>
        )}
      </div>

      {/* Fixed Save Button - Mobile */}
      {(!isNewCustomer && hasChanges) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
          <button
            onClick={handleSavePreferences}
            disabled={loading}
            className="w-full px-4 py-3 text-white rounded-lg font-medium disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Changes')}
          </button>
        </div>
      )}

      {/* Desktop Save Button */}
      {(!isNewCustomer && hasChanges) && (
        <div className="hidden md:flex justify-end px-6 mt-6">
          <button
            onClick={handleSavePreferences}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Changes')}
          </button>
        </div>
      )}
    </div>
  );
}