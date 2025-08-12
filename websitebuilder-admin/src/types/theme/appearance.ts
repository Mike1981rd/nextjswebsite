/**
 * Appearance Configuration Module
 * Handles page width, padding, and border radius settings
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Border radius size options for UI elements
 */
export type BorderRadiusSize = 'size-0' | 'size-1' | 'size-2' | 'size-3' | 'size-4';

/**
 * Human-readable labels for border radius sizes
 */
export const BorderRadiusLabels = {
  'size-0': 'Ninguno',
  'size-1': 'Extra pequeño',
  'size-2': 'Pequeño',
  'size-3': 'Mediano',
  'size-4': 'Grande'
} as const;

/**
 * Configuration interface for page appearance settings
 */
export interface AppearanceConfig {
  /** Maximum page width in pixels (slider control, max 2300px) */
  pageWidth: number;
  
  /** Lateral padding in pixels (slider control) */
  lateralPadding: number;
  
  /** Border radius size for UI elements */
  borderRadius: BorderRadiusSize;
}

/**
 * Default appearance configuration
 * These values are used when no custom configuration is provided
 */
export const defaultAppearance: AppearanceConfig = {
  pageWidth: 2300,
  lateralPadding: 31,
  borderRadius: 'size-2'
};

/**
 * Validates appearance configuration
 * @param config - Configuration to validate
 * @returns true if valid, false otherwise
 */
export function validateAppearanceConfig(config: Partial<AppearanceConfig>): boolean {
  if (config.pageWidth !== undefined) {
    if (config.pageWidth < 320 || config.pageWidth > 2300) {
      return false;
    }
  }
  
  if (config.lateralPadding !== undefined) {
    if (config.lateralPadding < 0 || config.lateralPadding > 200) {
      return false;
    }
  }
  
  if (config.borderRadius !== undefined) {
    const validSizes: BorderRadiusSize[] = ['size-0', 'size-1', 'size-2', 'size-3', 'size-4'];
    if (!validSizes.includes(config.borderRadius)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Merges partial configuration with defaults
 * @param partial - Partial configuration to merge
 * @returns Complete appearance configuration
 */
export function mergeWithDefaults(partial: Partial<AppearanceConfig>): AppearanceConfig {
  return {
    ...defaultAppearance,
    ...partial
  };
}