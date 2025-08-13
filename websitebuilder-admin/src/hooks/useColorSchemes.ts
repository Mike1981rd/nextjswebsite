import { useState, useEffect } from 'react';
import { ColorSchemesConfig } from '@/types/theme/colorSchemes';
import { useCompany } from '@/contexts/CompanyContext';

export function useColorSchemes() {
  const [colorSchemes, setColorSchemes] = useState<ColorSchemesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    if (company?.id) {
      fetchColorSchemes();
    }
  }, [company?.id]);

  const fetchColorSchemes = async () => {
    try {
      if (!company?.id) {
        setError('Company ID not available');
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5266/api/global-theme-config/company/${company.id}/color-schemes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch color schemes');
      }

      const data = await response.json();
      setColorSchemes(data);
    } catch (err) {
      console.error('Error fetching color schemes:', err);
      setError(err instanceof Error ? err.message : 'Error loading color schemes');
    } finally {
      setLoading(false);
    }
  };

  return { colorSchemes, loading, error, refetch: fetchColorSchemes };
}