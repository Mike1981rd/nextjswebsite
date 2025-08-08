'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { CustomerDetailDto } from '@/types/customer';
import { customerAPI } from '@/lib/api/customers';

interface CustomerSecurityTabProps {
  customer: CustomerDetailDto;
  primaryColor: string;
  onRefresh: () => void;
  isNewCustomer?: boolean;
}

export default function CustomerSecurityTab({ customer, primaryColor, onRefresh, isNewCustomer = false }: CustomerSecurityTabProps) {
  const { t } = useI18n();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(customer.isTwoFactorEnabled || false);
  const [twoFactorPhone, setTwoFactorPhone] = useState('');

  // For new customer, show password fields
  const [initialPassword, setInitialPassword] = useState('');
  const [initialConfirmPassword, setInitialConfirmPassword] = useState('');

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('customers.security.passwordMismatch', 'Passwords do not match'));
      return;
    }

    try {
      setLoading(true);
      await customerAPI.changePassword(customer.id, { newPassword });
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      alert(t('customers.security.passwordChanged', 'Password changed successfully'));
    } catch (error) {
      console.error('Error changing password:', error);
      alert(t('customers.security.passwordError', 'Error changing password'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (isNewCustomer) {
      setTwoFactorEnabled(!twoFactorEnabled);
    } else {
      try {
        if (!twoFactorEnabled) {
          if (!twoFactorPhone) {
            alert(t('customers.security.phoneRequired', 'Phone number is required for 2FA'));
            return;
          }
          await customerAPI.enableTwoFactor(customer.id, { phoneNumber: twoFactorPhone });
          setTwoFactorEnabled(true);
        } else {
          if (confirm(t('customers.security.confirmDisable2FA', 'Are you sure you want to disable 2FA?'))) {
            await customerAPI.disableTwoFactor(customer.id);
            setTwoFactorEnabled(false);
          }
        }
        onRefresh();
      } catch (error) {
        console.error('Error toggling 2FA:', error);
        alert(t('customers.security.twoFactorError', 'Error updating 2FA settings'));
      }
    }
  };

  const handleRevokeDevice = async (deviceId: number) => {
    if (confirm(t('customers.security.confirmRevoke', 'Are you sure you want to revoke access for this device?'))) {
      try {
        await customerAPI.revokeDevice(customer.id, deviceId);
        onRefresh();
      } catch (error) {
        console.error('Error revoking device:', error);
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Password Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.security.password', 'Password')}
          </h3>
          
          {isNewCustomer ? (
            // For new customer, show password input fields
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.security.initialPassword', 'Initial Password')} *
                </label>
                <input
                  type="password"
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder={t('customers.security.passwordPlaceholder', 'Enter initial password')}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('customers.security.passwordHint', 'Minimum 6 characters, include numbers and letters')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.security.confirmPassword', 'Confirm Password')} *
                </label>
                <input
                  type="password"
                  value={initialConfirmPassword}
                  onChange={(e) => setInitialConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder={t('customers.security.confirmPasswordPlaceholder', 'Confirm password')}
                  required
                />
              </div>
            </div>
          ) : (
            // For existing customer
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('customers.security.lastPasswordChange', 'Last password change')}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.lastPasswordChangeAt 
                      ? new Date(customer.lastPasswordChangeAt).toLocaleDateString()
                      : t('common.never', 'Never')
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t('customers.security.resetPassword', 'Reset Password')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('customers.security.twoFactor', 'Two-Factor Authentication')}
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    twoFactorEnabled 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {twoFactorEnabled 
                        ? t('customers.security.twoFactorEnabled', '2FA Enabled')
                        : t('customers.security.twoFactorDisabled', '2FA Disabled')
                      }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {twoFactorEnabled
                        ? t('customers.security.twoFactorDescription', 'Additional security layer is active')
                        : t('customers.security.twoFactorDescriptionDisabled', 'Enable for extra account protection')
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleTwoFactor}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={twoFactorEnabled ? { backgroundColor: primaryColor } : {}}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Phone number input for 2FA */}
            {!isNewCustomer && !twoFactorEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.security.phoneFor2FA', 'Phone Number for 2FA')}
                </label>
                <input
                  type="tel"
                  value={twoFactorPhone}
                  onChange={(e) => setTwoFactorPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder={t('customers.security.phonePlaceholder', '+1 234 567 8900')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Devices - Only for existing customers */}
      {!isNewCustomer && customer.devices && customer.devices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.security.activeDevices', 'Active Devices')}
            </h3>
            
            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
              {customer.devices.map((device) => (
                <div key={device.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {device.deviceType === 'Mobile' ? '📱' : 
                         device.deviceType === 'Tablet' ? '📱' : '💻'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.deviceName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {device.browser}
                        </p>
                      </div>
                    </div>
                    {device.isTrusted && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        {t('customers.security.trusted', 'Trusted')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <p>{device.location}</p>
                    <p>{t('customers.security.lastSeen', 'Last seen')}: {new Date(device.lastActivity).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleRevokeDevice(device.id)}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t('customers.security.revoke', 'Revoke')}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop: List */}
            <div className="hidden md:block divide-y divide-gray-200 dark:divide-gray-700">
              {customer.devices.map((device) => (
                <div key={device.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {device.deviceType === 'Mobile' ? '📱' : 
                       device.deviceType === 'Tablet' ? '📱' : '💻'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.deviceName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {device.browser} • {device.location}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('customers.security.lastSeen', 'Last seen')}: {new Date(device.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {device.isTrusted && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        {t('customers.security.trusted', 'Trusted')}
                      </span>
                    )}
                    <button
                      onClick={() => handleRevokeDevice(device.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {t('customers.security.revoke', 'Revoke')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Settings - For new customers */}
      {isNewCustomer && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.security.accountSettings', 'Account Settings')}
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('customers.security.sendWelcomeEmail', 'Send Welcome Email')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.security.welcomeEmailDescription', 'Send account credentials to customer')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('customers.security.requirePasswordChange', 'Require Password Change')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('customers.security.requirePasswordDescription', 'Force password change on first login')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && !isNewCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customers.security.resetPasswordTitle', 'Reset Customer Password')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.security.newPassword', 'New Password')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.security.confirmNewPassword', 'Confirm New Password')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}