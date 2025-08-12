/**
 * Header Component Configuration
 * Global header that appears on all pages
 */

/**
 * Header layout style options
 */
export type HeaderLayout = 
  | 'drawer' 
  | 'logo-left' 
  | 'logo-center' 
  | 'logo-center-menu-drawer'
  | 'top-center';

/**
 * Logo configuration for different screen sizes
 */
export interface LogoConfig {
  /** Logo image URL for desktop */
  desktopUrl: string;
  /** Logo image URL for mobile */
  mobileUrl?: string;
  /** Logo height in pixels */
  height: number;
  /** Logo width in pixels (auto if not specified) */
  width?: number;
  /** Alt text for accessibility */
  alt: string;
}

/**
 * Menu alignment options
 */
export type MenuAlignment = 'left' | 'center' | 'right';

/**
 * Sticky header behavior
 */
export interface StickyConfig {
  /** Enable sticky header */
  enabled: boolean;
  /** Always show or only on scroll up */
  alwaysShow: boolean;
  /** Reduce logo size when scrolled */
  reduceLogo: boolean;
  /** Background opacity when at top (0-100) */
  initialOpacity: number;
  /** Background opacity when scrolled (0-100) */
  scrolledOpacity: number;
}

/**
 * Header transparency options
 */
export interface TransparencyConfig {
  /** Enable transparent header on homepage */
  homepage: boolean;
  /** Enable transparent header on collection pages */
  collectionPages: boolean;
  /** Enable transparent header on product pages */
  productPages: boolean;
  /** Text color when transparent (light/dark) */
  textColor: 'light' | 'dark';
}

/**
 * Cart icon configuration
 */
export interface CartIconConfig {
  /** Show cart icon in header */
  show: boolean;
  /** Icon style */
  style: 'bag' | 'cart' | 'basket';
  /** Show item count badge */
  showCount: boolean;
  /** Badge color */
  badgeColor?: string;
}

/**
 * Search configuration in header
 */
export interface HeaderSearchConfig {
  /** Show search in header */
  show: boolean;
  /** Search style */
  style: 'icon' | 'bar' | 'modal';
  /** Placeholder text */
  placeholder: string;
  /** Enable predictive search */
  predictive: boolean;
}

/**
 * Complete header configuration
 */
export interface HeaderConfig {
  /** Header layout style */
  layout: HeaderLayout;
  
  /** Logo configuration */
  logo: LogoConfig;
  
  /** Main menu alignment */
  menuAlignment: MenuAlignment;
  
  /** Show menu labels on desktop */
  showMenuLabels: boolean;
  
  /** Sticky header configuration */
  sticky: StickyConfig;
  
  /** Transparency configuration */
  transparency: TransparencyConfig;
  
  /** Cart icon configuration */
  cart: CartIconConfig;
  
  /** Search configuration */
  search: HeaderSearchConfig;
  
  /** Show account icon */
  showAccount: boolean;
  
  /** Show language selector */
  showLanguageSelector: boolean;
  
  /** Show currency selector */
  showCurrencySelector: boolean;
  
  /** Custom CSS class */
  customClass?: string;
  
  /** Padding in pixels */
  padding: {
    desktop: { top: number; bottom: number };
    mobile: { top: number; bottom: number };
  };
}

/**
 * Default header configuration
 */
export const defaultHeaderConfig: HeaderConfig = {
  layout: 'logo-left',
  logo: {
    desktopUrl: '/logo.png',
    mobileUrl: '/logo-mobile.png',
    height: 40,
    alt: 'Company Logo'
  },
  menuAlignment: 'left',
  showMenuLabels: true,
  sticky: {
    enabled: true,
    alwaysShow: false,
    reduceLogo: true,
    initialOpacity: 100,
    scrolledOpacity: 100
  },
  transparency: {
    homepage: false,
    collectionPages: false,
    productPages: false,
    textColor: 'dark'
  },
  cart: {
    show: true,
    style: 'bag',
    showCount: true
  },
  search: {
    show: true,
    style: 'icon',
    placeholder: 'Search products...',
    predictive: true
  },
  showAccount: true,
  showLanguageSelector: false,
  showCurrencySelector: false,
  padding: {
    desktop: { top: 20, bottom: 20 },
    mobile: { top: 15, bottom: 15 }
  }
};