/**
 * @file FooterTypes.ts
 * @max-lines 100
 * @module Footer
 * @created 2025-01-15
 */

export enum FooterBlockType {
  LOGO_WITH_TEXT = 'logo-with-text',
  SUBSCRIBE = 'subscribe',
  SOCIAL_MEDIA = 'social-media',
  MENU = 'menu',
  TEXT = 'text',
  IMAGE = 'image'
}

export interface FooterBlock {
  id: string;
  type: FooterBlockType;
  title: string;
  visible: boolean;
  settings: any; // Configuración específica según el tipo
}

export interface FooterConfig {
  enabled: boolean;
  colorScheme: string;
  colorBackground: boolean;
  navigationMenuId?: string;
  desktopColumnCount: number;
  showSeparator: boolean;
  blocks: FooterBlock[]; // Bloques hijos del footer
  bottomBar: {
    enabled: boolean;
    content: 'subscribed' | 'payment' | 'locale' | 'none';
    showPaymentIcons: boolean;
  };
  copyrightNotice: string;
  followOnShop: {
    enabled: boolean;
  };
  languageSelector: {
    enabled: boolean;
    showSelector: boolean;
  };
  currencySelector: {
    enabled: boolean;
    showSelector: boolean;
  };
  policyLinks: {
    enabled: boolean;
    showLinks: boolean;
  };
  padding: {
    enabled: boolean;
    top: number;
    bottom: number;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    pinterest?: string;
    tiktok?: string;
    reddit?: string;
    tumblr?: string;
    snapchat?: string;
    linkedin?: string;
    vimeo?: string;
    flickr?: string;
    behance?: string;
    discord?: string;
    dribbble?: string;
    medium?: string;
    twitch?: string;
    whatsapp?: string;
    video?: string;
    telegram?: string;
    email?: string;
    balance?: string;
  };
  customCSS?: string;
}

export const getDefaultFooterConfig = (): FooterConfig => ({
  enabled: true,
  colorScheme: '1',
  colorBackground: false,
  navigationMenuId: '',
  desktopColumnCount: 3,
  showSeparator: false,
  blocks: [],
  bottomBar: {
    enabled: false,
    content: 'subscribed',
    showPaymentIcons: false
  },
  copyrightNotice: '',
  followOnShop: {
    enabled: false
  },
  languageSelector: {
    enabled: false,
    showSelector: false
  },
  currencySelector: {
    enabled: false,
    showSelector: false
  },
  policyLinks: {
    enabled: false,
    showLinks: false
  },
  padding: {
    enabled: false,
    top: 0,
    bottom: 0
  },
  socialMedia: {},
  customCSS: ''
});