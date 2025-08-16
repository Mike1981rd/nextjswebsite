'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';

interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  logoSize?: number;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  website?: string;
  description?: string;
  founded?: number;
  employees?: string;
  industry?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  orderIdPrefix?: string;
  orderIdStartNumber?: number;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  error: string | null;
  fetchCompany: () => Promise<void>;
  updateCompany: (data: Partial<Company>) => Promise<Company | null>;
  uploadLogo: (file: File) => Promise<string | null>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInitiatedRef = useRef(false);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/company/current');
      setCompany(response.data as Company);
    } catch (err: any) {
      console.error('Error fetching company:', err);
      setError(err.response?.data?.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (data: Partial<Company>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/company/current', data);
      const updatedCompany = response.data;
      setCompany(updatedCompany as Company);
      
      // Update localStorage for logo size
      if (data.logoSize !== undefined) {
        const settings = JSON.parse(localStorage.getItem('company-settings') || '{}');
        settings.logoSize = data.logoSize;
        localStorage.setItem('company-settings', JSON.stringify(settings));
      }
      
      return updatedCompany as Company;
    } catch (err: any) {
      console.error('Error updating company:', err);
      setError(err.response?.data?.message || 'Failed to update company');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadLogo = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/company/current/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const logoUrl = (response.data as any).logoUrl;
      setCompany(prev => prev ? { ...prev, logoUrl } : null);
      
      return logoUrl;
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      setError(err.response?.data?.message || 'Failed to upload logo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch company data once on mount
  useEffect(() => {
    if (fetchInitiatedRef.current) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      fetchInitiatedRef.current = true;
      fetchCompany();
    }
  }, []);

  return (
    <CompanyContext.Provider value={{
      company,
      loading,
      error,
      fetchCompany,
      updateCompany,
      uploadLogo
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}