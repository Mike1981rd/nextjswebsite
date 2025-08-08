// Customer API integration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266';

export interface Customer {
  id: number;
  customerId: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  country: string;
  status: string;
  accountBalance: number;
  totalSpent: number;
  totalOrders: number;
  loyaltyPoints: number;
  loyaltyTier: string;
  twoFactorEnabled: boolean;
  wishlistCount: number;
  couponsCount: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CustomerDetail extends Customer {
  twoFactorPhone?: string;
  addresses: CustomerAddress[];
  paymentMethods: CustomerPaymentMethod[];
  notificationPreferences: CustomerNotificationPreference[];
  recentDevices: CustomerDevice[];
  wishlistItems: CustomerWishlistItem[];
  coupons: CustomerCoupon[];
}

export interface CustomerAddress {
  id: number;
  type: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: string;
  fullAddress?: string;
}

export interface CustomerPaymentMethod {
  id: number;
  cardType: string;
  cardholderName: string;
  last4Digits: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddress?: string;
  isPrimary: boolean;
  createdAt: string;
  displayName?: string;
  expiryDate?: string;
  isExpired?: boolean;
}

export interface CustomerNotificationPreference {
  id: number;
  notificationType: string;
  displayName: string;
  description?: string;
  emailEnabled: boolean;
  browserEnabled: boolean;
  appEnabled: boolean;
}

export interface CustomerDevice {
  id: number;
  browser: string;
  deviceType: string;
  deviceName: string;
  operatingSystem: string;
  ipAddress: string;
  location: string;
  lastActivity: string;
  firstSeen: string;
  isTrusted: boolean;
  isActive: boolean;
  activityDisplay?: string;
  deviceDisplay?: string;
}

export interface CustomerWishlistItem {
  id: number;
  productId: number;
  productVariantId?: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  inStock: boolean;
  addedAt: string;
  notifyOnPriceChange: boolean;
  notifyOnBackInStock: boolean;
}

export interface CustomerCoupon {
  id: number;
  code: string;
  description: string;
  discountAmount: number;
  discountType: string;
  minimumPurchase?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
  maxUsageCount?: number;
  isValid?: boolean;
  isExpired?: boolean;
  canBeUsed?: boolean;
  status?: string;
  discountDisplay?: string;
  daysLeft?: number;
}

export interface CustomerFilter {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  country?: string;
  loyaltyTier?: string;
  minSpent?: number;
  maxSpent?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  country: string;
  status?: string;
  initialBalance?: number;
  initialLoyaltyPoints?: number;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  country?: string;
  status?: string;
  avatar?: string;
  accountBalance?: number;
  loyaltyPoints?: number;
  twoFactorEnabled?: boolean;
  twoFactorPhone?: string;
}

class CustomerAPI {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getCustomers(filter?: CustomerFilter): Promise<PagedResult<Customer>> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_URL}/api/customers?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error fetching customers:', response.status, error);
      throw new Error('Failed to fetch customers');
    }

    return response.json();
  }

  async getCustomer(id: number): Promise<CustomerDetail> {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error fetching customer:', response.status, error);
      throw new Error('Failed to fetch customer');
    }

    return response.json();
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    const response = await fetch(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error creating customer:', response.status, error);
      throw new Error('Failed to create customer');
    }

    return response.json();
  }

  async updateCustomer(id: number, data: UpdateCustomerDto): Promise<Customer> {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating customer:', response.status, error);
      throw new Error('Failed to update customer');
    }

    return response.json();
  }

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error deleting customer:', response.status, error);
      throw new Error('Failed to delete customer');
    }
  }

  async updateAvatar(id: number, data: { avatarUrl: string }): Promise<Customer> {
    const response = await fetch(`${API_URL}/api/customers/${id}/avatar`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating avatar:', response.status, error);
      throw new Error('Failed to update avatar');
    }

    return response.json();
  }

  async changePassword(id: number, newPassword: string, confirmPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${id}/change-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ newPassword, confirmPassword })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error changing password:', response.status, error);
      throw new Error('Failed to change password');
    }
  }

  async enableTwoFactor(id: number, phoneNumber: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${id}/two-factor/enable`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error enabling 2FA:', response.status, error);
      throw new Error('Failed to enable two-factor authentication');
    }
  }

  async disableTwoFactor(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${id}/two-factor/disable`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error disabling 2FA:', response.status, error);
      throw new Error('Failed to disable two-factor authentication');
    }
  }

  async updateNotificationPreferences(id: number, preferences: any): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${id}/notifications`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ preferences })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating notifications:', response.status, error);
      throw new Error('Failed to update notification preferences');
    }
  }

  // Additional detail page methods
  async getById(id: number): Promise<CustomerDetail> {
    return this.getCustomer(id);
  }

  async revokeDevice(customerId: number, deviceId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${customerId}/devices/${deviceId}/revoke`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Failed to revoke device');
  }

  async deleteAddress(customerId: number, addressId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${customerId}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete address');
  }

  async setDefaultAddress(customerId: number, addressId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${customerId}/addresses/${addressId}/set-default`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Failed to set default address');
  }

  async deletePaymentMethod(customerId: number, paymentMethodId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/customers/${customerId}/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete payment method');
  }

  // Export data functionality
  exportToCSV(customers: Customer[]): void {
    const headers = ['Customer ID', 'Name', 'Email', 'Country', 'Total Spent', 'Orders', 'Status'];
    const rows = customers.map(c => [
      c.customerId,
      c.fullName,
      c.email,
      c.country,
      c.totalSpent.toFixed(2),
      c.totalOrders.toString(),
      c.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export const customerAPI = new CustomerAPI();
export const customersApi = customerAPI; // Alias for backward compatibility