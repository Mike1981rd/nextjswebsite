/**
 * Hook for managing structural components (Header, Footer, Announcement Bar, Cart Drawer)
 */

import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { HeaderConfig } from '@/types/components/header';
import { 
  getStructuralComponents, 
  updateHeaderConfig as updateHeaderConfigApi,
  updateAnnouncementBarConfig,
  updateFooterConfig,
  updateCartDrawerConfig,
  publishStructuralComponents
} from '@/lib/api/structural-components';
import toast from 'react-hot-toast';

export interface StructuralComponentsConfig {
  header?: HeaderConfig;
  announcementBar?: any; // TODO: Add types
  footer?: any; // TODO: Add types
  cartDrawer?: any; // TODO: Add types
}

export function useStructuralComponents() {
  const { company } = useCompany();
  const [config, setConfig] = useState<StructuralComponentsConfig>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch structural components configuration
  const fetchConfig = useCallback(async () => {
    if (!company?.id) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await getStructuralComponents(company.id);
      
      // Parse JSON strings to objects
      const parsedConfig: StructuralComponentsConfig = {
        header: data.headerConfig ? JSON.parse(data.headerConfig) : undefined,
        announcementBar: data.announcementBarConfig ? JSON.parse(data.announcementBarConfig) : undefined,
        footer: data.footerConfig ? JSON.parse(data.footerConfig) : undefined,
        cartDrawer: data.cartDrawerConfig ? JSON.parse(data.cartDrawerConfig) : undefined,
      };
      
      setConfig(parsedConfig);
    } catch (err) {
      console.error('Error fetching structural components:', err);
      setError('Failed to load structural components configuration');
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  // Update header configuration
  const updateHeaderConfig = useCallback(async (headerConfig: HeaderConfig) => {
    if (!company?.id) return;

    setHasChanges(true);
    
    // Optimistic update
    setConfig(prev => ({
      ...prev,
      header: headerConfig
    }));

    try {
      await updateHeaderConfigApi(company.id, headerConfig);
      toast.success('Header configuration updated');
      setHasChanges(false);
    } catch (err) {
      console.error('Error updating header config:', err);
      toast.error('Failed to update header configuration');
      // Revert on error
      fetchConfig();
    }
  }, [company?.id, fetchConfig]);

  // Update announcement bar configuration
  const updateAnnouncementBar = useCallback(async (announcementBarConfig: any) => {
    if (!company?.id) return;

    setHasChanges(true);
    
    // Optimistic update
    setConfig(prev => ({
      ...prev,
      announcementBar: announcementBarConfig
    }));

    try {
      await updateAnnouncementBarConfig(company.id, announcementBarConfig);
      toast.success('Announcement bar configuration updated');
      setHasChanges(false);
    } catch (err) {
      console.error('Error updating announcement bar config:', err);
      toast.error('Failed to update announcement bar configuration');
      // Revert on error
      fetchConfig();
    }
  }, [company?.id, fetchConfig]);

  // Update footer configuration
  const updateFooter = useCallback(async (footerConfig: any) => {
    if (!company?.id) return;

    setHasChanges(true);
    
    // Optimistic update
    setConfig(prev => ({
      ...prev,
      footer: footerConfig
    }));

    try {
      await updateFooterConfig(company.id, footerConfig);
      toast.success('Footer configuration updated');
      setHasChanges(false);
    } catch (err) {
      console.error('Error updating footer config:', err);
      toast.error('Failed to update footer configuration');
      // Revert on error
      fetchConfig();
    }
  }, [company?.id, fetchConfig]);

  // Update cart drawer configuration
  const updateCartDrawer = useCallback(async (cartDrawerConfig: any) => {
    if (!company?.id) return;

    setHasChanges(true);
    
    // Optimistic update
    setConfig(prev => ({
      ...prev,
      cartDrawer: cartDrawerConfig
    }));

    try {
      await updateCartDrawerConfig(company.id, cartDrawerConfig);
      toast.success('Cart drawer configuration updated');
      setHasChanges(false);
    } catch (err) {
      console.error('Error updating cart drawer config:', err);
      toast.error('Failed to update cart drawer configuration');
      // Revert on error
      fetchConfig();
    }
  }, [company?.id, fetchConfig]);

  // Publish all structural components
  const publish = useCallback(async () => {
    if (!company?.id) return;

    setLoading(true);
    
    try {
      await publishStructuralComponents(company.id);
      toast.success('Structural components published successfully');
    } catch (err) {
      console.error('Error publishing structural components:', err);
      toast.error('Failed to publish structural components');
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  // Auto-fetch on mount and when company changes
  useEffect(() => {
    if (company?.id) {
      fetchConfig();
    }
  }, [company?.id, fetchConfig]);

  return {
    // State
    config,
    loading,
    error,
    hasChanges,
    
    // Header config specifically
    headerConfig: config.header,
    announcementBarConfig: config.announcementBar,
    footerConfig: config.footer,
    cartDrawerConfig: config.cartDrawer,
    
    // Actions
    updateHeaderConfig,
    updateAnnouncementBar,
    updateFooter,
    updateCartDrawer,
    publish,
    refresh: fetchConfig,
  };
}