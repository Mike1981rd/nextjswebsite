import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface ConfigOption {
  id: number;
  type: string;
  value: string;
  labelEs: string;
  labelEn: string;
  icon?: string;
  iconType?: string;
  category?: string;
  sortOrder: number;
  usageCount: number;
  isActive: boolean;
  isCustom: boolean;
  isDefault: boolean;
}

export function useConfigOptions(type: string) {
  const { language } = useI18n();
  const [options, setOptions] = useState<ConfigOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Opciones hardcodeadas como fallback
  const getFallbackOptions = () => {
    switch (type) {
      case 'amenity':
        return [
          { value: 'wifi', label: 'WiFi', icon: '📶' },
          { value: 'tv', label: 'TV', icon: '📺' },
          { value: 'ac', label: language === 'es' ? 'Aire Acondicionado' : 'Air Conditioning', icon: '❄️' },
          { value: 'heating', label: language === 'es' ? 'Calefacción' : 'Heating', icon: '🔥' },
          { value: 'minibar', label: 'Minibar', icon: '🍹' },
          { value: 'safe', label: language === 'es' ? 'Caja Fuerte' : 'Safe', icon: '🔒' },
          { value: 'balcony', label: language === 'es' ? 'Balcón' : 'Balcony', icon: '🏠' },
          { value: 'terrace', label: language === 'es' ? 'Terraza' : 'Terrace', icon: '☀️' },
          { value: 'jacuzzi', label: 'Jacuzzi', icon: '💆' },
          { value: 'pool', label: language === 'es' ? 'Piscina' : 'Pool', icon: '🏊' },
          { value: 'gym', label: language === 'es' ? 'Gimnasio' : 'Gym', icon: '🏋️' },
          { value: 'parking', label: language === 'es' ? 'Estacionamiento' : 'Parking', icon: '🚗' }
        ];
      case 'room_type':
        return [
          { value: 'standard', label: language === 'es' ? 'Estándar' : 'Standard' },
          { value: 'deluxe', label: 'Deluxe' },
          { value: 'suite', label: 'Suite' },
          { value: 'junior_suite', label: 'Junior Suite' },
          { value: 'presidential', label: language === 'es' ? 'Presidencial' : 'Presidential' },
          { value: 'penthouse', label: 'Penthouse' }
        ];
      case 'view_type':
        return [
          { value: 'sea', label: language === 'es' ? 'Vista al Mar' : 'Sea View', icon: '🌊' },
          { value: 'city', label: language === 'es' ? 'Vista a la Ciudad' : 'City View', icon: '🏙️' },
          { value: 'garden', label: language === 'es' ? 'Vista al Jardín' : 'Garden View', icon: '🌳' },
          { value: 'pool', label: language === 'es' ? 'Vista a la Piscina' : 'Pool View', icon: '🏊' },
          { value: 'mountain', label: language === 'es' ? 'Vista a la Montaña' : 'Mountain View', icon: '⛰️' },
          { value: 'interior', label: language === 'es' ? 'Vista Interior' : 'Interior View', icon: '🏠' }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [type, language]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        // Si no hay token, usar opciones hardcodeadas
        setOptions(getFallbackOptions());
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ConfigOptions/type/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Si hay cualquier error (404, 401, 500, etc), usar opciones hardcodeadas
        console.log(`Using fallback options for ${type} (API returned ${response.status})`);
        setOptions(getFallbackOptions());
        return;
      }

      const data = await response.json();
      
      // Mapear las opciones con el idioma correcto
      const mappedOptions = data.map((opt: ConfigOption) => ({
        value: opt.value,
        label: language === 'es' ? opt.labelEs : opt.labelEn,
        icon: opt.icon,
        iconType: opt.iconType,
        category: opt.category,
        isCustom: opt.isCustom
      }));

      setOptions(mappedOptions);
    } catch (err) {
      // En caso de error, usar opciones hardcodeadas silenciosamente
      console.log(`Using fallback options for ${type} (network error)`);
      setOptions(getFallbackOptions());
    } finally {
      setLoading(false);
    }
  };

  // Función para incrementar el uso de una opción
  const incrementUsage = async (value: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ConfigOptions/increment-usage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, value })
      });
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  return { options, loading, error, incrementUsage };
}