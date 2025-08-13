import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266';

interface MenuItem {
  label: string;
  link: string;
  type?: string;
  order: number;
  subItems?: MenuItem[];
}

interface NavigationMenu {
  id: number;
  name: string;
  identifier: string;
  menuType?: string;
  items?: MenuItem[];
  isActive: boolean;
}

interface NavigationMenusResponse {
  items: NavigationMenu[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function useNavigationMenus() {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNavigationMenus();
  }, []);

  const fetchNavigationMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication required');
        setMenus([]);
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/NavigationMenu/active`;
      console.log('Fetching navigation menus from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // If unauthorized or not found, return empty array instead of throwing
        if (response.status === 401 || response.status === 404) {
          console.warn(`Navigation menus endpoint returned ${response.status}, using empty array`);
          setMenus([]);
          return;
        }
        
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch navigation menus: ${response.status}`);
      }

      const data = await response.json();
      console.log('Navigation menus received:', data);
      
      // Handle empty response
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log('No navigation menus found');
        setMenus([]);
        return;
      }
      
      // Parse items if they come as JSON string
      const menusWithParsedItems = (Array.isArray(data) ? data : []).map((menu: any) => ({
        ...menu,
        items: menu.items ? (typeof menu.items === 'string' ? JSON.parse(menu.items) : menu.items) : []
      }));
      
      console.log('Parsed menus:', menusWithParsedItems);
      setMenus(menusWithParsedItems);
    } catch (err) {
      console.error('Error fetching navigation menus:', err);
      setError(err instanceof Error ? err.message : 'Failed to load navigation menus');
      // Set empty array on error to prevent UI issues
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    menus,
    loading,
    error,
    refetch: fetchNavigationMenus
  };
}