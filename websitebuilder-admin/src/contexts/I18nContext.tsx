'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
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

  const t = (key: string, params?: Record<string, any>): string => {
    if (!isLoaded) {
      console.log('Traducciones no cargadas para:', key);
      return key;
    }

    // Debug para navigation.editor
    if (key === 'navigation.editor') {
      console.log('Buscando navigation.editor:', {
        language,
        translations: translations[language]?.navigation,
        editor: translations[language]?.navigation?.editor
      });
    }

    let translation = getNestedValue(translations[language], key);
    
    // Si no encuentra traducción, intentar con fallback a español
    if (!translation && language !== 'es') {
      translation = getNestedValue(translations.es, key);
    }
    
    // Si aún no hay traducción, devolver la key
    if (!translation) {
      return key;
    }

    // Si la traducción es un objeto con title y count (caso especial)
    if (typeof translation === 'object' && translation !== null) {
      // Buscar la propiedad más relevante
      if ('title' in translation) {
        translation = translation.title;
      } else if ('text' in translation) {
        translation = translation.text;
      } else {
        // Si es un objeto sin propiedades conocidas, convertir a string
        translation = JSON.stringify(translation);
      }
    }

    // Convertir a string si no lo es
    if (typeof translation !== 'string') {
      return String(translation);
    }

    // Si hay parámetros, realizar interpolación
    if (params) {
      let result = translation;
      Object.keys(params).forEach(param => {
        // Soportar tanto {param} como {{param}}
        const regex1 = new RegExp(`\\{\\{${param}\\}\\}`, 'g');
        const regex2 = new RegExp(`\\{${param}\\}`, 'g');
        result = result.replace(regex1, String(params[param]));
        result = result.replace(regex2, String(params[param]));
      });
      return result;
    }

    return translation;
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