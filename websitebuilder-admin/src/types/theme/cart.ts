/**
 * Cart Configuration Module
 * Manages shopping cart display and free shipping settings
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Cart display options
 */
export type CartDisplayType = 'drawer-only' | 'page-only' | 'drawer-and-page';

/**
 * Track style for progress bar
 */
export type TrackStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Cart display configuration
 */
export interface CartDisplayConfig {
  /** How to show the cart */
  showAs: CartDisplayType;
  
  /** Whether to show a fixed cart icon */
  showFixedCart: boolean;
}

/**
 * Cart colors configuration
 */
export interface CartColorsConfig {
  /** Background color for cart */
  background: string;
  
  /** Text color for cart */
  text: string;
}

/**
 * Free shipping progress bar configuration
 */
export interface FreeShippingConfig {
  /** Whether to show the progress bar */
  showProgressBar: boolean;
  
  /** Threshold amount for free shipping */
  threshold: number;
  
  /** Color of the progress bar */
  barColor: string;
  
  /** Style of the progress track */
  trackStyle: TrackStyle;
  
  /** Color of the message text */
  messageColor: string;
}

/**
 * Complete cart configuration
 */
export interface CartConfig {
  /** Display settings */
  display: CartDisplayConfig;
  
  /** Color settings */
  colors: CartColorsConfig;
  
  /** Free shipping settings */
  freeShipping: FreeShippingConfig;
}

/**
 * Default cart configuration
 * Based on specifications from prompt.pdf
 */
export const defaultCart: CartConfig = {
  display: {
    showAs: 'drawer-only',
    showFixedCart: true
  },
  colors: {
    background: '#000000',
    text: '#FFFFFF'
  },
  freeShipping: {
    showProgressBar: true,
    threshold: 4, // This seems to be a low value, might need adjustment
    barColor: '#000000',
    trackStyle: 'solid',
    messageColor: '#FFFFFF'
  }
};

/**
 * Cart display type labels for UI
 */
export const CartDisplayLabels: Record<CartDisplayType, string> = {
  'drawer-only': 'Solo cajón lateral',
  'page-only': 'Solo página completa',
  'drawer-and-page': 'Cajón y página'
};

/**
 * Track style labels for UI
 */
export const TrackStyleLabels: Record<TrackStyle, string> = {
  'solid': 'Sólido',
  'dashed': 'Punteado',
  'dotted': 'Puntos'
};

/**
 * Calculates free shipping progress
 * @param currentTotal - Current cart total
 * @param threshold - Free shipping threshold
 * @returns Progress percentage (0-100)
 */
export function calculateFreeShippingProgress(
  currentTotal: number,
  threshold: number
): number {
  if (threshold <= 0) return 100;
  if (currentTotal <= 0) return 0;
  
  const progress = (currentTotal / threshold) * 100;
  return Math.min(progress, 100);
}

/**
 * Generates free shipping message
 * @param currentTotal - Current cart total
 * @param threshold - Free shipping threshold
 * @param currencySymbol - Currency symbol to use
 * @returns Appropriate message
 */
export function getFreeShippingMessage(
  currentTotal: number,
  threshold: number,
  currencySymbol: string = '$'
): string {
  const remaining = threshold - currentTotal;
  
  if (remaining <= 0) {
    return '¡Felicitaciones! Tu pedido califica para envío gratis';
  }
  
  return `Agrega ${currencySymbol}${remaining.toFixed(2)} más para envío gratis`;
}

/**
 * Validates cart configuration
 * @param config - Cart configuration to validate
 * @returns true if valid, false otherwise
 */
export function validateCartConfig(config: Partial<CartConfig>): boolean {
  if (config.freeShipping?.threshold !== undefined) {
    if (config.freeShipping.threshold < 0) {
      return false;
    }
  }
  
  if (config.colors?.background || config.colors?.text) {
    // Validate hex colors
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (config.colors.background && !hexRegex.test(config.colors.background)) {
      return false;
    }
    if (config.colors.text && !hexRegex.test(config.colors.text)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Merges partial cart configuration with defaults
 * @param partial - Partial configuration to merge
 * @returns Complete cart configuration
 */
export function mergeCartWithDefaults(partial: Partial<CartConfig>): CartConfig {
  return {
    display: {
      ...defaultCart.display,
      ...partial.display
    },
    colors: {
      ...defaultCart.colors,
      ...partial.colors
    },
    freeShipping: {
      ...defaultCart.freeShipping,
      ...partial.freeShipping
    }
  };
}