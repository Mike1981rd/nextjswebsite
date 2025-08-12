'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/stores/useEditorStore';
import { Slider } from '@/components/ui/slider';
import { useGlobalThemeConfig } from '@/hooks/useGlobalThemeConfig';
import { BorderRadiusLabels, BorderRadiusSize } from '@/types/theme/appearance';
import { TypographyConfig, FontConfig, defaultTypography } from '@/types/theme/typography';
import { ColorSchemesConfig, defaultColorSchemes } from '@/types/theme/colorSchemes';
import { ProductCardsConfig, defaultProductCards } from '@/types/theme/productCards';
import { ProductBadgesConfig, defaultProductBadges } from '@/types/theme/productBadges';
import { CartConfig, defaultCart } from '@/types/theme/cart';
import { FaviconConfig, defaultFavicon } from '@/types/theme/favicon';
import { FontPicker } from '@/components/ui/font-picker';
import { ProductCardsSection } from './ProductCardsSection';
import { ProductBadgesSection } from './ProductBadgesSection';
import { CartSection } from './CartSection';
import { FaviconSection } from './FaviconSection';
import { NavigationSection } from './NavigationSection';
import { NavigationConfig, defaultNavigation } from '@/types/theme/navigation';
import { SocialMediaSection } from './SocialMediaSection';
import { SocialMediaConfig, defaultSocialMedia } from '@/types/theme/socialMedia';
import { SwatchesSection } from './SwatchesSection';
import { SwatchesConfig, defaultSwatches } from '@/types/theme/swatches';
import { useGlobalSettingsTranslations } from '@/hooks/useEditorTranslations';
import toast from 'react-hot-toast';

interface SettingSection {
  id: string;
  name: string;
  isExpanded: boolean;
}

export function GlobalSettingsPanel() {
  const { toggleGlobalSettings } = useEditorStore();
  const { t } = useGlobalSettingsTranslations();
  const { 
    appearance, 
    typography,
    colorSchemes,
    productCards,
    productBadges,
    cart,
    favicon,
    navigation,
    socialMedia,
    swatches,
    loading, 
    updateAppearance, 
    updateTypography,
    updateColorSchemes,
    updateProductCards,
    updateProductBadges,
    updateCart,
    updateFavicon,
    updateNavigation,
    updateSocialMedia,
    updateSwatches
  } = useGlobalThemeConfig();
  const [localAppearance, setLocalAppearance] = useState(appearance);
  const [localTypography, setLocalTypography] = useState<TypographyConfig>(typography || defaultTypography);
  const [localColorSchemes, setLocalColorSchemes] = useState<ColorSchemesConfig>(colorSchemes || defaultColorSchemes);
  const [localProductCards, setLocalProductCards] = useState<ProductCardsConfig>(productCards || defaultProductCards);
  // Initialize Product Badges with complete structure to avoid null values
  const [localProductBadges, setLocalProductBadges] = useState<ProductBadgesConfig>(() => {
    const badges = productBadges || defaultProductBadges;
    return {
      position: badges.position || { desktop: 'below-image' },
      soldOut: {
        enabled: badges.soldOut?.enabled ?? true,
        background: badges.soldOut?.background || '#FFFFFF',
        text: badges.soldOut?.text || '#000000',
        displayAs: badges.soldOut?.displayAs || '',
        textContent: badges.soldOut?.textContent || '',
        tag: badges.soldOut?.tag || ''
      },
      sale: {
        enabled: badges.sale?.enabled ?? true,
        background: badges.sale?.background || '#FF0000',
        text: badges.sale?.text || '#FFFFFF',
        displayAs: badges.sale?.displayAs || 'sale',
        textContent: badges.sale?.textContent || '',
        tag: badges.sale?.tag || ''
      },
      saleByPrice: {
        enabled: badges.saleByPrice?.enabled ?? false,
        background: badges.saleByPrice?.background || '#000000',
        text: badges.saleByPrice?.text || '#FFFFFF',
        displayAs: badges.saleByPrice?.displayAs || 'percentage',
        textContent: badges.saleByPrice?.textContent || '',
        tag: badges.saleByPrice?.tag || ''
      },
      saleHighlight: {
        enabled: badges.saleHighlight?.enabled ?? false,
        textColor: badges.saleHighlight?.textColor || '#000000'
      },
      custom1: {
        enabled: badges.custom1?.enabled ?? false,
        background: badges.custom1?.background || '#FFFFFF',
        text: badges.custom1?.text || '#000000',
        displayAs: badges.custom1?.displayAs || '',
        textContent: badges.custom1?.textContent || 'Best seller',
        tag: badges.custom1?.tag || ''
      },
      custom2: {
        enabled: badges.custom2?.enabled ?? false,
        background: badges.custom2?.background || '#FFFFFF',
        text: badges.custom2?.text || '#000000',
        displayAs: badges.custom2?.displayAs || '',
        textContent: badges.custom2?.textContent || '',
        tag: badges.custom2?.tag || ''
      },
      custom3: {
        enabled: badges.custom3?.enabled ?? false,
        background: badges.custom3?.background || '#FFFFFF',
        text: badges.custom3?.text || '#000000',
        displayAs: badges.custom3?.displayAs || '',
        textContent: badges.custom3?.textContent || '',
        tag: badges.custom3?.tag || ''
      }
    };
  });
  // Initialize Cart with complete structure
  const [localCart, setLocalCart] = useState<CartConfig>(() => {
    const cartData = cart || defaultCart;
    return {
      drawerType: cartData.drawerType || 'drawer-and-page',
      showStickyCart: cartData.showStickyCart ?? false,
      cartStatusColors: {
        background: cartData.cartStatusColors?.background || '#F0FF2E',
        text: cartData.cartStatusColors?.text || '#383933'
      },
      freeShipping: {
        showProgress: cartData.freeShipping?.showProgress ?? true,
        threshold: cartData.freeShipping?.threshold ?? 0,
        progressBarColor: cartData.freeShipping?.progressBarColor || '#383933',
        successMessage: cartData.freeShipping?.successMessage || '¡Envío gratis conseguido!',
        progressMessage: cartData.freeShipping?.progressMessage || 'Te faltan {amount} para envío gratis'
      }
    };
  });
  // Initialize Favicon
  const [localFavicon, setLocalFavicon] = useState<FaviconConfig>(() => {
    const faviconData = favicon || defaultFavicon;
    return {
      customFavicon: faviconData.customFavicon ?? true,
      faviconUrl: faviconData.faviconUrl || '/favicon-custom.ico'
    };
  });
  // Initialize Navigation
  const [localNavigation, setLocalNavigation] = useState<NavigationConfig>(() => {
    const navData = navigation || defaultNavigation;
    return {
      search: {
        showAs: navData.search?.showAs || 'drawer-and-page'
      },
      backToTop: {
        showButton: navData.backToTop?.showButton ?? true,
        position: navData.backToTop?.position || 'bottom-left'
      }
    };
  });
  // Initialize Social Media
  const [localSocialMedia, setLocalSocialMedia] = useState<SocialMediaConfig>(() => {
    return socialMedia || defaultSocialMedia;
  });
  // Initialize Swatches
  const [localSwatches, setLocalSwatches] = useState<SwatchesConfig>(() => {
    return swatches || defaultSwatches;
  });
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Create sections with translations
  const sections = useMemo(() => [
    { id: 'appearance', name: t('themeConfig.appearance.title', 'Apariencia'), isExpanded: false },
    { id: 'typography', name: t('themeConfig.typography.title', 'Tipografía'), isExpanded: false },
    { id: 'colorSchemes', name: t('themeConfig.colorSchemes.title', 'Esquemas de color'), isExpanded: false },
    { id: 'productCards', name: t('themeConfig.productCards.title', 'Tarjetas de producto'), isExpanded: false },
    { id: 'productBadges', name: t('themeConfig.productBadges.title', 'Product badges'), isExpanded: false },
    { id: 'cart', name: t('themeConfig.cart.title', 'Carrito'), isExpanded: false },
    { id: 'favicon', name: t('themeConfig.favicon.title', 'Favicon'), isExpanded: false },
    { id: 'navigation', name: t('themeConfig.navigation.title', 'Navegación'), isExpanded: false },
    { id: 'socialMedia', name: t('themeConfig.socialMedia.title', 'Redes sociales'), isExpanded: false },
    { id: 'swatches', name: t('themeConfig.swatches.title', 'Muestras'), isExpanded: false },
  ], [t]);
  
  const [sectionsState, setSectionsState] = useState<SettingSection[]>(sections);

  // Update sections state when language changes
  useEffect(() => {
    setSectionsState(prevSections => 
      prevSections.map((prevSection, index) => ({
        ...prevSection,
        name: sections[index].name
      }))
    );
  }, [sections]);

  useEffect(() => {
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPrimaryColor(parsed.primaryColor || '#22c55e');
    }
  }, []);

  useEffect(() => {
    if (appearance) {
      setLocalAppearance(appearance);
    }
  }, [appearance]);

  useEffect(() => {
    if (colorSchemes) {
      setLocalColorSchemes(colorSchemes);
    }
  }, [colorSchemes]);

  useEffect(() => {
    if (productCards) {
      setLocalProductCards(productCards);
    }
  }, [productCards]);

  useEffect(() => {
    if (productBadges) {
      // Ensure complete structure when updating from store
      setLocalProductBadges({
        position: productBadges.position || { desktop: 'below-image' },
        soldOut: {
          enabled: productBadges.soldOut?.enabled ?? true,
          background: productBadges.soldOut?.background || '#FFFFFF',
          text: productBadges.soldOut?.text || '#000000',
          displayAs: productBadges.soldOut?.displayAs || '',
          textContent: productBadges.soldOut?.textContent || '',
          tag: productBadges.soldOut?.tag || ''
        },
        sale: {
          enabled: productBadges.sale?.enabled ?? true,
          background: productBadges.sale?.background || '#FF0000',
          text: productBadges.sale?.text || '#FFFFFF',
          displayAs: productBadges.sale?.displayAs || 'sale',
          textContent: productBadges.sale?.textContent || '',
          tag: productBadges.sale?.tag || ''
        },
        saleByPrice: {
          enabled: productBadges.saleByPrice?.enabled ?? false,
          background: productBadges.saleByPrice?.background || '#000000',
          text: productBadges.saleByPrice?.text || '#FFFFFF',
          displayAs: productBadges.saleByPrice?.displayAs || 'percentage',
          textContent: productBadges.saleByPrice?.textContent || '',
          tag: productBadges.saleByPrice?.tag || ''
        },
        saleHighlight: {
          enabled: productBadges.saleHighlight?.enabled ?? false,
          textColor: productBadges.saleHighlight?.textColor || '#000000'
        },
        custom1: {
          enabled: productBadges.custom1?.enabled ?? false,
          background: productBadges.custom1?.background || '#FFFFFF',
          text: productBadges.custom1?.text || '#000000',
          displayAs: productBadges.custom1?.displayAs || '',
          textContent: productBadges.custom1?.textContent || 'Best seller',
          tag: productBadges.custom1?.tag || ''
        },
        custom2: {
          enabled: productBadges.custom2?.enabled ?? false,
          background: productBadges.custom2?.background || '#FFFFFF',
          text: productBadges.custom2?.text || '#000000',
          displayAs: productBadges.custom2?.displayAs || '',
          textContent: productBadges.custom2?.textContent || '',
          tag: productBadges.custom2?.tag || ''
        },
        custom3: {
          enabled: productBadges.custom3?.enabled ?? false,
          background: productBadges.custom3?.background || '#FFFFFF',
          text: productBadges.custom3?.text || '#000000',
          displayAs: productBadges.custom3?.displayAs || '',
          textContent: productBadges.custom3?.textContent || '',
          tag: productBadges.custom3?.tag || ''
        }
      });
    }
  }, [productBadges]);

  useEffect(() => {
    if (cart) {
      // Ensure complete structure when updating from store
      setLocalCart({
        drawerType: cart.drawerType || 'drawer-and-page',
        showStickyCart: cart.showStickyCart ?? false,
        cartStatusColors: {
          background: cart.cartStatusColors?.background || '#F0FF2E',
          text: cart.cartStatusColors?.text || '#383933'
        },
        freeShipping: {
          showProgress: cart.freeShipping?.showProgress ?? true,
          threshold: cart.freeShipping?.threshold ?? 0,
          progressBarColor: cart.freeShipping?.progressBarColor || '#383933',
          successMessage: cart.freeShipping?.successMessage || '¡Envío gratis conseguido!',
          progressMessage: cart.freeShipping?.progressMessage || 'Te faltan {amount} para envío gratis'
        }
      });
    }
  }, [cart]);

  useEffect(() => {
    if (favicon) {
      setLocalFavicon({
        customFavicon: favicon.customFavicon ?? true,
        faviconUrl: favicon.faviconUrl || '/favicon-custom.ico'
      });
    }
  }, [favicon]);

  useEffect(() => {
    if (navigation) {
      setLocalNavigation({
        search: {
          showAs: navigation.search?.showAs || 'drawer-and-page'
        },
        backToTop: {
          showButton: navigation.backToTop?.showButton ?? true,
          position: navigation.backToTop?.position || 'bottom-left'
        }
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (socialMedia) {
      setLocalSocialMedia(socialMedia);
    }
  }, [socialMedia]);

  useEffect(() => {
    if (swatches) {
      setLocalSwatches(swatches);
    }
  }, [swatches]);

  // Load Google Fonts when typography changes
  useEffect(() => {
    if (typography) {
      // Collect all unique fonts from typography config
      const fonts = new Set<string>();
      Object.values(typography).forEach((config: any) => {
        if (config?.fontFamily) {
          fonts.add(config.fontFamily);
        }
      });
      
      // Load fonts using WebFont loader if available
      if (fonts.size > 0 && typeof window !== 'undefined') {
        const fontsArray = Array.from(fonts);
        
        // Dynamically load WebFont if not already loaded
        if (!(window as any).WebFont) {
          const script = document.createElement('script');
          script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
          script.onload = () => {
            (window as any).WebFont.load({
              google: {
                families: fontsArray.map(font => `${font}:400,700`)
              }
            });
          };
          document.head.appendChild(script);
        } else {
          (window as any).WebFont.load({
            google: {
              families: fontsArray.map(font => `${font}:400,700`)
            }
          });
        }
      }
    }
  }, [typography]);

  useEffect(() => {
    if (!typography) {
      setLocalTypography(defaultTypography);
      return;
    }
    
    // Always ensure we have a complete typography config with all required fields
    const mergedTypography: TypographyConfig = {
      headings: {
        fontFamily: typography.headings?.fontFamily || defaultTypography.headings.fontFamily,
        fontWeight: typography.headings?.fontWeight !== undefined ? typography.headings.fontWeight : defaultTypography.headings.fontWeight,
        useUppercase: typography.headings?.useUppercase !== undefined ? typography.headings.useUppercase : defaultTypography.headings.useUppercase,
        fontSize: typography.headings?.fontSize !== undefined ? typography.headings.fontSize : defaultTypography.headings.fontSize,
        letterSpacing: typography.headings?.letterSpacing !== undefined ? typography.headings.letterSpacing : defaultTypography.headings.letterSpacing
      },
      body: {
        fontFamily: typography.body?.fontFamily || defaultTypography.body.fontFamily,
        fontWeight: typography.body?.fontWeight !== undefined ? typography.body.fontWeight : defaultTypography.body.fontWeight,
        useUppercase: typography.body?.useUppercase !== undefined ? typography.body.useUppercase : defaultTypography.body.useUppercase,
        fontSize: typography.body?.fontSize !== undefined ? typography.body.fontSize : defaultTypography.body.fontSize,
        letterSpacing: typography.body?.letterSpacing !== undefined ? typography.body.letterSpacing : defaultTypography.body.letterSpacing
      },
      menu: {
        fontFamily: typography.menu?.fontFamily || defaultTypography.menu.fontFamily,
        fontWeight: typography.menu?.fontWeight !== undefined ? typography.menu.fontWeight : defaultTypography.menu.fontWeight,
        useUppercase: typography.menu?.useUppercase !== undefined ? typography.menu.useUppercase : defaultTypography.menu.useUppercase,
        fontSize: typography.menu?.fontSize !== undefined ? typography.menu.fontSize : defaultTypography.menu.fontSize,
        letterSpacing: typography.menu?.letterSpacing !== undefined ? typography.menu.letterSpacing : defaultTypography.menu.letterSpacing
      },
      productCardName: {
        fontFamily: typography.productCardName?.fontFamily || defaultTypography.productCardName.fontFamily,
        fontWeight: typography.productCardName?.fontWeight !== undefined ? typography.productCardName.fontWeight : defaultTypography.productCardName.fontWeight,
        useUppercase: typography.productCardName?.useUppercase !== undefined ? typography.productCardName.useUppercase : defaultTypography.productCardName.useUppercase,
        fontSize: typography.productCardName?.fontSize !== undefined ? typography.productCardName.fontSize : defaultTypography.productCardName.fontSize,
        letterSpacing: typography.productCardName?.letterSpacing !== undefined ? typography.productCardName.letterSpacing : defaultTypography.productCardName.letterSpacing
      },
      buttons: {
        fontFamily: typography.buttons?.fontFamily || defaultTypography.buttons.fontFamily,
        fontWeight: typography.buttons?.fontWeight !== undefined ? typography.buttons.fontWeight : defaultTypography.buttons.fontWeight,
        useUppercase: typography.buttons?.useUppercase !== undefined ? typography.buttons.useUppercase : defaultTypography.buttons.useUppercase,
        fontSize: typography.buttons?.fontSize !== undefined ? typography.buttons.fontSize : defaultTypography.buttons.fontSize,
        letterSpacing: typography.buttons?.letterSpacing !== undefined ? typography.buttons.letterSpacing : defaultTypography.buttons.letterSpacing
      }
    };
    
    // Debug logs removed for production
    setLocalTypography(mergedTypography);
  }, [typography]);

  // Detect changes
  useEffect(() => {
    let hasAnyChange = false;
    
    if (localAppearance && appearance) {
      hasAnyChange = hasAnyChange || 
        localAppearance.pageWidth !== appearance.pageWidth ||
        localAppearance.lateralPadding !== appearance.lateralPadding ||
        localAppearance.borderRadius !== appearance.borderRadius;
    }
    
    if (localTypography && typography) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localTypography) !== JSON.stringify(typography);
    }
    
    if (localColorSchemes && colorSchemes) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localColorSchemes) !== JSON.stringify(colorSchemes);
    }
    
    if (localProductCards && productCards) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localProductCards) !== JSON.stringify(productCards);
    }
    
    if (localProductBadges && productBadges) {
      const localStr = JSON.stringify(localProductBadges);
      const storeStr = JSON.stringify(productBadges);
      hasAnyChange = hasAnyChange || localStr !== storeStr;
      
      // Product badges change detection
    }
    
    if (localCart && cart) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localCart) !== JSON.stringify(cart);
    }
    
    if (localFavicon && favicon) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localFavicon) !== JSON.stringify(favicon);
    }
    
    if (localNavigation && navigation) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localNavigation) !== JSON.stringify(navigation);
    }
    
    if (localSocialMedia && socialMedia) {
      hasAnyChange = hasAnyChange || 
        JSON.stringify(localSocialMedia) !== JSON.stringify(socialMedia);
    }
    
    setHasChanges(hasAnyChange);
  }, [localAppearance, appearance, localTypography, typography, localColorSchemes, colorSchemes, localProductCards, productCards, localProductBadges, productBadges, localCart, cart, localFavicon, favicon, localNavigation, navigation, localSocialMedia, socialMedia]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setSaving(true);
    try {
      const promises = [];
      
      if (localAppearance) {
        const localStr = JSON.stringify(localAppearance);
        const storeStr = JSON.stringify(appearance);
        if (localStr !== storeStr) {
          promises.push(updateAppearance(localAppearance));
        }
      }
      
      if (localTypography) {
        const localStr = JSON.stringify(localTypography);
        const storeStr = JSON.stringify(typography);
        if (localStr !== storeStr) {
          // Saving typography
          promises.push(updateTypography(localTypography));
        }
      }
      
      if (localColorSchemes) {
        const localStr = JSON.stringify(localColorSchemes);
        const storeStr = JSON.stringify(colorSchemes);
        if (localStr !== storeStr) {
          // Saving color schemes
          promises.push(updateColorSchemes(localColorSchemes));
        }
      }
      
      if (localProductCards) {
        const localStr = JSON.stringify(localProductCards);
        const storeStr = JSON.stringify(productCards);
        if (localStr !== storeStr) {
          // Saving product cards
          promises.push(updateProductCards(localProductCards));
        }
      }
      
      if (localProductBadges) {
        const localStr = JSON.stringify(localProductBadges);
        const storeStr = JSON.stringify(productBadges);
        
        if (localStr !== storeStr) {
          // Saving product badges with updated structure
          promises.push(updateProductBadges(localProductBadges));
        }
      }
      
      if (localCart) {
        const localStr = JSON.stringify(localCart);
        const storeStr = JSON.stringify(cart);
        
        if (localStr !== storeStr) {
          // Saving cart configuration
          promises.push(updateCart(localCart));
        }
      }
      
      if (localFavicon) {
        const localStr = JSON.stringify(localFavicon);
        const storeStr = JSON.stringify(favicon);
        
        if (localStr !== storeStr) {
          // Saving favicon configuration
          promises.push(updateFavicon(localFavicon));
        }
      }
      
      if (localNavigation) {
        const localStr = JSON.stringify(localNavigation);
        const storeStr = JSON.stringify(navigation);
        
        if (localStr !== storeStr) {
          // Saving navigation configuration
          promises.push(updateNavigation(localNavigation));
        }
      }
      
      if (localSocialMedia) {
        const localStr = JSON.stringify(localSocialMedia);
        const storeStr = JSON.stringify(socialMedia);
        
        if (localStr !== storeStr) {
          // Saving social media configuration
          promises.push(updateSocialMedia(localSocialMedia));
        }
      }
      
      if (localSwatches) {
        const localStr = JSON.stringify(localSwatches);
        const storeStr = JSON.stringify(swatches);
        
        if (localStr !== storeStr) {
          // Saving swatches configuration
          promises.push(updateSwatches(localSwatches));
        }
      }
      
      await Promise.all(promises);
      
      // After successful save, the store should have the updated values
      // The local state will be updated via the useEffect hooks
      toast.success('Configuración guardada exitosamente');
      setHasChanges(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSectionsState(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  // Helper function to render typography controls for each section
  const renderTypographySection = (title: string, key: keyof TypographyConfig) => {
    if (!localTypography) return null;
    
    const section = localTypography[key];
    if (!section) return null;
    
    // Ensure fontWeight is always a string
    if (!section.fontWeight || typeof section.fontWeight === 'number') {
      section.fontWeight = '400';
    }
    
    return (
      <div className="space-y-3 pb-3">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</h4>
        
        {/* Font Family Input */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Fuente</label>
          <FontPicker
            value={section?.fontFamily || ''}
            onChange={(font) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], fontFamily: font }
            }))}
            placeholder="Buscar fuentes..."
            primaryColor={primaryColor}
          />
        </div>

        {/* Use Uppercase Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-600">Usar mayúsculas</label>
          <button
            onClick={() => {
              const newValue = !section.useUppercase;
              setLocalTypography(prev => ({
                ...prev,
                [key]: { ...prev[key], useUppercase: newValue }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              section?.useUppercase ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                section?.useUppercase ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Font Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-600">Tamaño de fuente</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={section?.fontSize || 100}
                onChange={(e) => setLocalTypography(prev => ({
                  ...prev,
                  [key]: { ...prev[key], fontSize: parseInt(e.target.value) || 100 }
                }))}
                className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded text-center"
                min="8"
                max="200"
              />
              <span className="text-xs text-gray-500">
                {(section?.fontSize || 100) <= 100 ? '%' : 'px'}
              </span>
            </div>
          </div>
          <Slider
            value={[section?.fontSize || 100]}
            onValueChange={(value) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], fontSize: value[0] }
            }))}
            min={8}
            max={200}
            step={1}
            className="w-full"
            primaryColor={primaryColor}
          />
        </div>

        {/* Letter Spacing Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-600">Espaciado entre letras</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={section?.letterSpacing || 0}
                onChange={(e) => setLocalTypography(prev => ({
                  ...prev,
                  [key]: { ...prev[key], letterSpacing: parseFloat(e.target.value) || 0 }
                }))}
                className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded text-center"
                min="-5"
                max="10"
                step="0.1"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <Slider
            value={[section?.letterSpacing || 0]}
            onValueChange={(value) => setLocalTypography(prev => ({
              ...prev,
              [key]: { ...prev[key], letterSpacing: value[0] }
            }))}
            min={-5}
            max={10}
            step={0.1}
            className="w-full"
            primaryColor={primaryColor}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-[280px] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleGlobalSettings()}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">{t('editor.panels.globalSettings', 'Configuración del tema')}</span>
          </div>
          
          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>{t('editor.messages.saving', 'Guardando...')}</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  <span>{t('editor.actions.save', 'Guardar')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Sections List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sectionsState.map((section) => (
          <div key={section.id} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{section.name}</span>
              {section.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {section.isExpanded && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                {section.id === 'appearance' && (
                  <div className="space-y-6">
                    {/* Page Width Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-700">
                          {t('themeConfig.appearance.pageWidth', 'Page width')}
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={localAppearance?.pageWidth || 1400}
                            onChange={(e) => setLocalAppearance(prev => 
                              prev ? { ...prev, pageWidth: parseInt(e.target.value) || 1400 } : prev
                            )}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                            min="320"
                            max="3000"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <Slider
                        value={[localAppearance?.pageWidth || 1400]}
                        onValueChange={(value) => setLocalAppearance(prev => 
                          prev ? { ...prev, pageWidth: value[0] } : prev
                        )}
                        min={320}
                        max={3000}
                        step={10}
                        className="w-full"
                        primaryColor={primaryColor}
                      />
                    </div>

                    {/* Side Padding Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-700">
                          {t('themeConfig.appearance.contentPadding', 'Side padding size')}
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={localAppearance?.lateralPadding || 34}
                            onChange={(e) => setLocalAppearance(prev => 
                              prev ? { ...prev, lateralPadding: parseInt(e.target.value) || 34 } : prev
                            )}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                            min="0"
                            max="200"
                          />
                          <span className="text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <Slider
                        value={[localAppearance?.lateralPadding || 34]}
                        onValueChange={(value) => setLocalAppearance(prev => 
                          prev ? { ...prev, lateralPadding: value[0] } : prev
                        )}
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                        primaryColor={primaryColor}
                      />
                    </div>

                    {/* Border Radius Select */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        {t('themeConfig.appearance.borderRadius', 'Edge rounding')}
                      </label>
                      <select 
                        value={localAppearance?.borderRadius || 'size-3'}
                        onChange={(e) => setLocalAppearance(prev => 
                          prev ? { ...prev, borderRadius: e.target.value as BorderRadiusSize } : prev
                        )}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2"
                        style={{ 
                          '--tw-ring-color': primaryColor,
                        } as React.CSSProperties}
                      >
                        {Object.entries(BorderRadiusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                {section.id === 'typography' && localTypography && (
                  <div className="space-y-6">
                    {renderTypographySection(t('themeConfig.typography.headings', 'Encabezados'), 'headings')}
                    {renderTypographySection(t('themeConfig.typography.body', 'Cuerpo'), 'body')}
                    {renderTypographySection(t('themeConfig.typography.menu', 'Menú'), 'menu')}
                    {renderTypographySection(t('themeConfig.typography.productCardName', 'Nombre de tarjeta de producto'), 'productCardName')}
                    {renderTypographySection(t('themeConfig.typography.buttons', 'Botones'), 'buttons')}
                  </div>
                )}
                
                {section.id === 'colorSchemes' && (
                  <div className="space-y-3">
                    {/* Scheme Selector - Compact Design */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        Select Scheme to Configure
                      </label>
                      <select 
                        value={localColorSchemes?.defaultScheme || 'scheme-1'}
                        onChange={(e) => {
                          setLocalColorSchemes(prev => ({
                            ...prev,
                            defaultScheme: e.target.value
                          }));
                        }}
                        className="w-full px-2.5 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      >
                        {localColorSchemes?.schemes.map(scheme => (
                          <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Fields - Compact Layout */}
                    {localColorSchemes && (() => {
                      const activeScheme = localColorSchemes.schemes.find(
                        s => s.id === localColorSchemes.defaultScheme
                      ) || localColorSchemes.schemes[0];

                      if (!activeScheme) return null;

                      const colorGroups = [
                        {
                          title: 'Basic',
                          colors: [
                            { key: 'text', label: 'Text' },
                            { key: 'background', label: 'Background' },
                            { key: 'foreground', label: 'Foreground' },
                            { key: 'border', label: 'Border' },
                            { key: 'link', label: 'Link' }
                          ]
                        },
                        {
                          title: 'Buttons',
                          colors: [
                            { key: 'solidButton', label: 'Solid button' },
                            { key: 'solidButtonText', label: 'Solid button text' },
                            { key: 'outlineButton', label: 'Outline button' },
                            { key: 'outlineButtonText', label: 'Outline button text' }
                          ]
                        },
                        {
                          title: 'Effects',
                          colors: [
                            { key: 'imageOverlay', label: 'Image overlay' }
                          ]
                        }
                      ];

                      return (
                        <div className="space-y-3">
                          {colorGroups.map(group => (
                            <div key={group.title}>
                              <h5 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {group.title}
                              </h5>
                              <div className="space-y-2">
                                {group.colors.map(({ key, label }) => (
                                  <div key={key} className="flex items-center gap-1.5">
                                    <label className="text-xs text-gray-600 w-20 flex-shrink-0">
                                      {label}
                                    </label>
                                    <input
                                      type="color"
                                      value={activeScheme[key as keyof typeof activeScheme] as string || '#000000'}
                                      onChange={(e) => {
                                        const updatedSchemes = localColorSchemes.schemes.map(s => 
                                          s.id === activeScheme.id 
                                            ? { ...s, [key]: e.target.value }
                                            : s
                                        );
                                        setLocalColorSchemes({
                                          ...localColorSchemes,
                                          schemes: updatedSchemes
                                        });
                                      }}
                                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={activeScheme[key as keyof typeof activeScheme] as string || ''}
                                      onChange={(e) => {
                                        const updatedSchemes = localColorSchemes.schemes.map(s => 
                                          s.id === activeScheme.id 
                                            ? { ...s, [key]: e.target.value }
                                            : s
                                        );
                                        setLocalColorSchemes({
                                          ...localColorSchemes,
                                          schemes: updatedSchemes
                                        });
                                      }}
                                      className="w-24 px-1.5 py-1 text-xs font-mono border border-gray-300 rounded focus:border-blue-400 focus:outline-none"
                                      placeholder={key === 'imageOverlay' ? 'rgba(0,0,0,0.1)' : '#000000'}
                                    />
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          activeScheme[key as keyof typeof activeScheme] as string || ''
                                        );
                                        toast.success('Copied!', { duration: 1000 });
                                      }}
                                      className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                      title="Copy"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {section.id === 'productCards' && (
                  <ProductCardsSection 
                    localProductCards={localProductCards}
                    setLocalProductCards={setLocalProductCards}
                  />
                )}
                
                {section.id === 'productBadges' && (
                  <ProductBadgesSection 
                    config={localProductBadges}
                    onChange={setLocalProductBadges}
                  />
                )}
                
                {section.id === 'cart' && (
                  <CartSection 
                    config={localCart}
                    onChange={setLocalCart}
                  />
                )}
                
                {section.id === 'favicon' && (
                  <FaviconSection 
                    config={localFavicon}
                    onChange={setLocalFavicon}
                  />
                )}
                
                {section.id === 'navigation' && (
                  <NavigationSection 
                    config={localNavigation}
                    onChange={setLocalNavigation}
                  />
                )}
                
                {section.id === 'socialMedia' && (
                  <SocialMediaSection 
                    config={localSocialMedia}
                    onChange={setLocalSocialMedia}
                  />
                )}
                
                {section.id === 'swatches' && (
                  <SwatchesSection 
                    config={localSwatches}
                    onChange={(newSwatches) => {
                      setLocalSwatches(newSwatches);
                      setHasChanges(true);
                    }}
                  />
                )}
                
                {/* Placeholder for other sections */}
                {!['appearance', 'typography', 'colorSchemes', 'productCards', 'productBadges', 'cart', 'favicon', 'navigation', 'socialMedia', 'swatches'].includes(section.id) && (
                  <p className="text-xs text-gray-500">Configuración próximamente...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
