/**
 * Swatches Configuration Module
 * Manages visual display of product variants (colors, sizes, materials)
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Type of swatch display
 */
export type SwatchType = 'color' | 'image' | 'text';

/**
 * Shape of swatch element
 */
export type SwatchShape = 'circle' | 'square' | 'rounded';

/**
 * Size of swatch element
 */
export type SwatchSize = 'small' | 'medium' | 'large';

/**
 * Individual swatch item
 */
export interface SwatchItem {
  /** Unique identifier */
  id: string;
  
  /** Display value (color hex, image URL, or text) */
  value: string;
  
  /** Label/tooltip text */
  label: string;
  
  /** Type of swatch */
  type: SwatchType;
  
  /** Whether this swatch is available */
  available?: boolean;
}

/**
 * Swatch display configuration
 */
export interface SwatchDisplayConfig {
  /** Shape of swatches */
  shape: SwatchShape;
  
  /** Size of swatches */
  size: SwatchSize;
  
  /** Whether to show border around swatches */
  showBorder: boolean;
  
  /** Border color for swatches */
  borderColor?: string;
  
  /** Whether to show tooltip on hover */
  showTooltip: boolean;
  
  /** Whether to show checkmark on selected swatch */
  showCheckmark: boolean;
  
  /** Maximum swatches to show before "more" button */
  maxVisible?: number;
}

/**
 * Complete swatches configuration
 */
export interface SwatchesConfig {
  /** Display settings for color swatches */
  colorSwatches: SwatchDisplayConfig;
  
  /** Display settings for size swatches */
  sizeSwatches: SwatchDisplayConfig;
  
  /** Display settings for material/texture swatches */
  materialSwatches: SwatchDisplayConfig;
  
  /** Whether to group swatches by type */
  groupByType: boolean;
  
  /** Whether to show unavailable swatches as disabled */
  showUnavailable: boolean;
  
  /** Text to show when no swatches available */
  noSwatchesText?: string;
}

/**
 * Default swatches configuration
 */
export const defaultSwatches: SwatchesConfig = {
  colorSwatches: {
    shape: 'circle',
    size: 'medium',
    showBorder: true,
    borderColor: '#E5E5E5',
    showTooltip: true,
    showCheckmark: true,
    maxVisible: 5
  },
  sizeSwatches: {
    shape: 'square',
    size: 'medium',
    showBorder: true,
    borderColor: '#E5E5E5',
    showTooltip: false,
    showCheckmark: false,
    maxVisible: 8
  },
  materialSwatches: {
    shape: 'rounded',
    size: 'medium',
    showBorder: true,
    borderColor: '#E5E5E5',
    showTooltip: true,
    showCheckmark: false,
    maxVisible: 4
  },
  groupByType: true,
  showUnavailable: true,
  noSwatchesText: 'No hay opciones disponibles'
};

/**
 * Size dimensions in pixels
 */
export const swatchSizes: Record<SwatchSize, number> = {
  small: 24,
  medium: 32,
  large: 40
};

/**
 * Gets CSS classes for swatch shape
 * @param shape - Swatch shape
 * @returns CSS class string
 */
export function getSwatchShapeClass(shape: SwatchShape): string {
  const shapeClasses: Record<SwatchShape, string> = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-md'
  };
  
  return shapeClasses[shape];
}

/**
 * Gets CSS styles for swatch size
 * @param size - Swatch size
 * @returns CSS style object
 */
export function getSwatchSizeStyles(size: SwatchSize): React.CSSProperties {
  const dimension = swatchSizes[size];
  
  return {
    width: `${dimension}px`,
    height: `${dimension}px`,
    minWidth: `${dimension}px`,
    minHeight: `${dimension}px`
  };
}

/**
 * Creates a color swatch item
 * @param color - Hex color value
 * @param label - Display label
 * @param available - Whether the color is available
 * @returns SwatchItem
 */
export function createColorSwatch(
  color: string,
  label: string,
  available: boolean = true
): SwatchItem {
  return {
    id: `color-${color.replace('#', '')}`,
    value: color,
    label,
    type: 'color',
    available
  };
}

/**
 * Creates a size swatch item
 * @param size - Size value (S, M, L, XL, etc.)
 * @param label - Display label
 * @param available - Whether the size is available
 * @returns SwatchItem
 */
export function createSizeSwatch(
  size: string,
  label?: string,
  available: boolean = true
): SwatchItem {
  return {
    id: `size-${size.toLowerCase()}`,
    value: size,
    label: label || size,
    type: 'text',
    available
  };
}

/**
 * Creates an image swatch item
 * @param imageUrl - Image URL
 * @param label - Display label
 * @param available - Whether the variant is available
 * @returns SwatchItem
 */
export function createImageSwatch(
  imageUrl: string,
  label: string,
  available: boolean = true
): SwatchItem {
  return {
    id: `image-${label.toLowerCase().replace(/\s+/g, '-')}`,
    value: imageUrl,
    label,
    type: 'image',
    available
  };
}

/**
 * Groups swatches by type
 * @param swatches - Array of swatch items
 * @returns Grouped swatches
 */
export function groupSwatchesByType(swatches: SwatchItem[]): Record<SwatchType, SwatchItem[]> {
  return swatches.reduce((groups, swatch) => {
    if (!groups[swatch.type]) {
      groups[swatch.type] = [];
    }
    groups[swatch.type].push(swatch);
    return groups;
  }, {} as Record<SwatchType, SwatchItem[]>);
}

/**
 * Validates swatches configuration
 * @param config - Swatches configuration to validate
 * @returns true if valid, false otherwise
 */
export function validateSwatchesConfig(config: Partial<SwatchesConfig>): boolean {
  // Validate border colors if provided
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  if (config.colorSwatches?.borderColor && 
      !hexRegex.test(config.colorSwatches.borderColor)) {
    return false;
  }
  
  if (config.sizeSwatches?.borderColor && 
      !hexRegex.test(config.sizeSwatches.borderColor)) {
    return false;
  }
  
  if (config.materialSwatches?.borderColor && 
      !hexRegex.test(config.materialSwatches.borderColor)) {
    return false;
  }
  
  // Validate maxVisible values
  const configs = [config.colorSwatches, config.sizeSwatches, config.materialSwatches];
  for (const swatchConfig of configs) {
    if (swatchConfig?.maxVisible !== undefined && 
        (swatchConfig.maxVisible < 1 || swatchConfig.maxVisible > 20)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Merges partial swatches configuration with defaults
 * @param partial - Partial configuration to merge
 * @returns Complete swatches configuration
 */
export function mergeSwatchesWithDefaults(partial: Partial<SwatchesConfig>): SwatchesConfig {
  return {
    colorSwatches: {
      ...defaultSwatches.colorSwatches,
      ...partial.colorSwatches
    },
    sizeSwatches: {
      ...defaultSwatches.sizeSwatches,
      ...partial.sizeSwatches
    },
    materialSwatches: {
      ...defaultSwatches.materialSwatches,
      ...partial.materialSwatches
    },
    groupByType: partial.groupByType ?? defaultSwatches.groupByType,
    showUnavailable: partial.showUnavailable ?? defaultSwatches.showUnavailable,
    noSwatchesText: partial.noSwatchesText ?? defaultSwatches.noSwatchesText
  };
}