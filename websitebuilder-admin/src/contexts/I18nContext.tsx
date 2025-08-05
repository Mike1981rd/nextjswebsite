'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

// Almacenar las traducciones cargadas
let translations: Record<Language, any> = {
  es: {},
  en: {}
};

// Función para obtener valor anidado de un objeto usando dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>('es');
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar traducciones al inicializar
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Cargar traducciones en español
        const esModule = await import('../lib/i18n/translations/es.json');
        translations.es = esModule.default;

        // Cargar traducciones en inglés
        const enModule = await import('../lib/i18n/translations/en.json');
        translations.en = enModule.default;

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading translations:', error);
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, []);

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, defaultValue?: string): string => {
    if (!isLoaded) {
      return defaultValue || key;
    }

    const translation = getNestedValue(translations[language], key);
    
    if (translation) {
      return translation;
    }

    // Fallback a español si no encuentra en el idioma actual
    if (language !== 'es') {
      const fallback = getNestedValue(translations.es, key);
      if (fallback) {
        return fallback;
      }
    }

    // Último fallback: devolver defaultValue o la key
    return defaultValue || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Export types
export type { Language };