/**
 * Product Cards Configuration Module
 * Manages display settings for product cards in the e-commerce system
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Image aspect ratio options (9 different ratios)
 */
export type ImageRatio =
  | 'square-1-1-fill'
  | 'portrait-large-2-3-fill'
  | 'portrait-3-4-fill'
  | 'portrait-large-2-3-fit'
  | 'horizontal-4-3-fill'
  | 'square-1-1-fit'
  | 'portrait-3-4-fit'
  | 'portrait-large-2-3-fit'
  | 'horizontal-4-3-fit';

/**
 * Product rating display options (6 different styles)
 */
export type ProductRating =
  | 'average-and-stars'
  | 'none'
  | 'stars-only'
  | 'reviews-count-only'
  | 'average-only'
  | 'reviews-and-stars';

/**
 * Price label size options
 */
export type PriceLabelSize = 'extra-small' | 'small' | 'medium' | 'large';

/**
 * Hover effect options for product cards
 */
export type HoverEffect = 'none' | 'zoom' | 'show-all-media' | 'show-second-media';

/**
 * Desktop display style for buttons
 */
export type ButtonStyle = 'labels' | 'icons';

/**
 * Position options for swatches on desktop and mobile
 */
export type SwatchPosition = 'on-image' | 'below-image' | 'above-title';

/**
 * What type of swatches to display
 */
export type SwatchDisplayType = 'color-swatches' | 'variant-images' | 'both';

/**
 * Complete product cards configuration
 */
export interface ProductCardsConfig {
  /** Image display settings */
  image: {
    defaultRatio: ImageRatio;
  };
  
  /** Visibility settings for various elements */
  visibility: {
    showVendor: boolean;
    showCurrencyCode: boolean;
    showColorCount: boolean;
    colorizeCardBackground: boolean;
    darkenImageBackground: boolean;
  };
  
  /** Product rating display settings */
  rating: {
    productRating: ProductRating;
  };
  
  /** Price display settings */
  price: {
    labelSize: PriceLabelSize;
  };
  
  /** Hover effects configuration */
  effects: {
    hoverEffect: HoverEffect;
  };
  
  /** Swatches/variants display settings */
  swatches: {
    whatToShow: SwatchDisplayType;
    desktopPosition: SwatchPosition;
    mobilePosition: SwatchPosition;
    hideForSingleColor: boolean;
  };
  
  /** Action buttons configuration */
  buttons: {
    quickBuy: boolean;
    showQuickView: boolean;
    showAddToCart: boolean;
    desktopStyle: ButtonStyle;
    showOnHover: boolean;
  };
}

/**
 * Default product cards configuration
 */
export const defaultProductCards: ProductCardsConfig = {
  image: {
    defaultRatio: 'square-1-1-fill'
  },
  visibility: {
    showVendor: false,
    showCurrencyCode: true,
    showColorCount: true,
    colorizeCardBackground: true,
    darkenImageBackground: true
  },
  rating: {
    productRating: 'average-and-stars'
  },
  price: {
    labelSize: 'large'
  },
  effects: {
    hoverEffect: 'none'
  },
  swatches: {
    whatToShow: 'color-swatches',
    desktopPosition: 'below-image',
    mobilePosition: 'below-image',
    hideForSingleColor: true
  },
  buttons: {
    quickBuy: false,
    showQuickView: false,
    showAddToCart: false,
    desktopStyle: 'labels',
    showOnHover: true
  }
};

/**
 * Human-readable labels for image ratios
 */
export const ImageRatioLabels: Record<ImageRatio, string> = {
  'square-1-1-fill': 'Cuadrado (1:1) - Llenar',
  'portrait-large-2-3-fill': 'Retrato grande (2:3) - Llenar',
  'portrait-3-4-fill': 'Retrato (3:4) - Llenar',
  'portrait-large-2-3-fit': 'Retrato grande (2:3) - Ajustar',
  'horizontal-4-3-fill': 'Horizontal (4:3) - Llenar',
  'square-1-1-fit': 'Cuadrado (1:1) - Ajustar',
  'portrait-3-4-fit': 'Retrato (3:4) - Ajustar',
  'horizontal-4-3-fit': 'Horizontal (4:3) - Ajustar'
};

/**
 * Human-readable labels for rating options
 */
export const RatingLabels: Record<ProductRating, string> = {
  'average-and-stars': 'Promedio y estrellas',
  'none': 'No mostrar',
  'stars-only': 'Solo estrellas',
  'reviews-count-only': 'Solo contador de reseñas',
  'average-only': 'Solo promedio',
  'reviews-and-stars': 'Reseñas y estrellas'
};

/**
 * Calculates aspect ratio for CSS
 * @param ratio - Image ratio type
 * @returns CSS aspect ratio value
 */
export function getAspectRatio(ratio: ImageRatio): string {
  const ratioMap: Record<ImageRatio, string> = {
    'square-1-1-fill': '1 / 1',
    'square-1-1-fit': '1 / 1',
    'portrait-large-2-3-fill': '2 / 3',
    'portrait-large-2-3-fit': '2 / 3',
    'portrait-3-4-fill': '3 / 4',
    'portrait-3-4-fit': '3 / 4',
    'horizontal-4-3-fill': '4 / 3',
    'horizontal-4-3-fit': '4 / 3'
  };
  
  return ratioMap[ratio] || '1 / 1';
}

/**
 * Determines object-fit CSS property based on ratio
 * @param ratio - Image ratio type
 * @returns CSS object-fit value
 */
export function getObjectFit(ratio: ImageRatio): 'cover' | 'contain' {
  return ratio.includes('fill') ? 'cover' : 'contain';
}