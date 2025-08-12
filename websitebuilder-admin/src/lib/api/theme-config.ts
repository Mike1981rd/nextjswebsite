/**
 * API Client for Global Theme Configuration
 * Implements modular endpoints to avoid large JSON transfers
 */

import { api } from '@/lib/api';
import type { 
  GlobalThemeConfig,
  AppearanceConfig,
  TypographyConfig,
  ColorSchemesConfig,
  ProductCardsConfig,
  ProductBadgesConfig,
  CartConfig,
  FaviconConfig,
  NavigationConfig,
  SocialMediaConfig,
  SwatchesConfig
} from '@/types/theme';

const BASE_URL = '/GlobalThemeConfig';

/**
 * Theme Configuration API Service
 */
export const themeConfigApi = {
  /**
   * Get complete theme configuration for a company
   */
  async getByCompanyId(companyId: number): Promise<GlobalThemeConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}`);
    return response.data;
  },

  // Individual module getters for optimized loading
  async getAppearance(companyId: number): Promise<AppearanceConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/appearance`);
    return response.data;
  },

  async getTypography(companyId: number): Promise<TypographyConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/typography`);
    return response.data;
  },

  async getColorSchemes(companyId: number): Promise<ColorSchemesConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/color-schemes`);
    return response.data;
  },

  async getProductCards(companyId: number): Promise<ProductCardsConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/product-cards`);
    return response.data;
  },

  async getProductBadges(companyId: number): Promise<ProductBadgesConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/product-badges`);
    return response.data;
  },

  async getCart(companyId: number): Promise<CartConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/cart`);
    return response.data;
  },

  async getFavicon(companyId: number): Promise<FaviconConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/favicon`);
    return response.data;
  },

  async getNavigation(companyId: number): Promise<NavigationConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/navigation`);
    return response.data;
  },

  async getSocialMedia(companyId: number): Promise<SocialMediaConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/social-media`);
    return response.data;
  },

  async getSwatches(companyId: number): Promise<SwatchesConfig> {
    const response = await api.get(`${BASE_URL}/company/${companyId}/swatches`);
    return response.data;
  },

  /**
   * Update complete theme configuration
   */
  async updateComplete(companyId: number, config: GlobalThemeConfig): Promise<GlobalThemeConfig> {
    const response = await api.put(`${BASE_URL}/company/${companyId}`, config);
    return response.data;
  },

  /**
   * Update individual modules using PATCH for optimal performance
   */
  async updateAppearance(companyId: number, appearance: AppearanceConfig): Promise<AppearanceConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/appearance`, appearance);
    return response.data;
  },

  async updateTypography(companyId: number, typography: TypographyConfig): Promise<TypographyConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/typography`, typography);
    return response.data;
  },

  async updateColorSchemes(companyId: number, colorSchemes: ColorSchemesConfig): Promise<ColorSchemesConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/color-schemes`, colorSchemes);
    return response.data;
  },

  async updateProductCards(companyId: number, productCards: ProductCardsConfig): Promise<ProductCardsConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/product-cards`, productCards);
    return response.data;
  },

  async updateProductBadges(companyId: number, productBadges: ProductBadgesConfig): Promise<ProductBadgesConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/product-badges`, productBadges);
    return response.data;
  },

  async updateCart(companyId: number, cart: CartConfig): Promise<CartConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/cart`, cart);
    return response.data;
  },

  async updateFavicon(companyId: number, favicon: FaviconConfig): Promise<FaviconConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/favicon`, favicon);
    return response.data;
  },

  async updateNavigation(companyId: number, navigation: NavigationConfig): Promise<NavigationConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/navigation`, navigation);
    return response.data;
  },

  async updateSocialMedia(companyId: number, socialMedia: SocialMediaConfig): Promise<SocialMediaConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/social-media`, socialMedia);
    return response.data;
  },

  async updateSwatches(companyId: number, swatches: SwatchesConfig): Promise<SwatchesConfig> {
    const response = await api.patch(`${BASE_URL}/company/${companyId}/swatches`, swatches);
    return response.data;
  },

  /**
   * Special operations
   */
  async publish(companyId: number): Promise<{ message: string }> {
    const response = await api.post(`${BASE_URL}/company/${companyId}/publish`);
    return response.data;
  },

  async createDraft(companyId: number): Promise<GlobalThemeConfig> {
    const response = await api.post(`${BASE_URL}/company/${companyId}/create-draft`);
    return response.data;
  },

  async resetModule(companyId: number, moduleName: string): Promise<{ message: string }> {
    const response = await api.post(`${BASE_URL}/company/${companyId}/reset-module/${moduleName}`);
    return response.data;
  },

  async resetAll(companyId: number): Promise<GlobalThemeConfig> {
    const response = await api.post(`${BASE_URL}/company/${companyId}/reset-all`);
    return response.data;
  }
};

export default themeConfigApi;