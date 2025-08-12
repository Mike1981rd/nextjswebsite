/**
 * Color Schemes Configuration Module
 * Manages up to 5 color schemes with 11 color properties each
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Individual color scheme configuration
 * Contains all color properties for a complete theme
 */
export interface ColorScheme {
  /** Unique identifier for the scheme */
  id: string;
  
  /** Display name for the scheme */
  name: string;
  
  /** Main text color */
  text: string;
  
  /** Page background color */
  background: string;
  
  /** Foreground/accent color */
  foreground: string;
  
  /** Border color for elements */
  border: string;
  
  /** Link color */
  link: string;
  
  /** Solid button background color */
  solidButton: string;
  
  /** Solid button text color */
  solidButtonText: string;
  
  /** Outline button border/text color */
  outlineButton: string;
  
  /** Outline button text color */
  outlineButtonText: string;
  
  /** Image overlay color (RGBA format for transparency) */
  imageOverlay: string;
}

/**
 * Container for multiple color schemes
 * Allows up to 5 different schemes
 */
export interface ColorSchemesConfig {
  /** ID of the currently active scheme */
  defaultScheme: string;
  
  /** Array of color schemes (maximum 5) */
  schemes: ColorScheme[];
}

/**
 * Default color schemes configuration
 * Includes one default scheme as per specifications
 */
export const defaultColorSchemes: ColorSchemesConfig = {
  defaultScheme: 'scheme-1',
  schemes: [
    {
      id: 'scheme-1',
      name: 'Scheme 1',
      text: '#000000',
      background: '#FFFFFF',
      foreground: '#F5E076',
      border: '#000000',
      link: '#F74703',
      solidButton: '#F74703',
      solidButtonText: '#FFFFFF',
      outlineButton: '#990F02',
      outlineButtonText: '#000000',
      imageOverlay: 'rgba(0, 0, 0, 0.1)'
    }
  ]
};

/**
 * Maximum number of color schemes allowed
 */
export const MAX_COLOR_SCHEMES = 5;

/**
 * Validates a hex color string
 * @param color - Color string to validate
 * @returns true if valid hex color or rgba
 */
export function isValidColor(color: string): boolean {
  // Check for hex color
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  // Check for rgba color
  const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
  
  return hexRegex.test(color) || rgbaRegex.test(color);
}

/**
 * Validates a color scheme
 * @param scheme - Color scheme to validate
 * @returns true if all colors are valid
 */
export function validateColorScheme(scheme: Partial<ColorScheme>): boolean {
  const colorProperties = [
    'text', 'background', 'foreground', 'border', 'link',
    'solidButton', 'solidButtonText', 'outlineButton',
    'outlineButtonText', 'imageOverlay'
  ];
  
  for (const prop of colorProperties) {
    const value = scheme[prop as keyof ColorScheme];
    if (value && typeof value === 'string' && !isValidColor(value)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Creates a new color scheme with unique ID
 * @param name - Display name for the scheme
 * @param baseScheme - Optional scheme to copy from
 * @returns New color scheme
 */
export function createColorScheme(
  name: string,
  baseScheme?: ColorScheme
): ColorScheme {
  const timestamp = Date.now();
  const newScheme: ColorScheme = {
    id: `scheme-${timestamp}`,
    name,
    ...(baseScheme ? { ...baseScheme, id: `scheme-${timestamp}`, name } : {
      text: '#000000',
      background: '#FFFFFF',
      foreground: '#F5E076',
      border: '#000000',
      link: '#0066CC',
      solidButton: '#000000',
      solidButtonText: '#FFFFFF',
      outlineButton: '#000000',
      outlineButtonText: '#000000',
      imageOverlay: 'rgba(0, 0, 0, 0.1)'
    })
  };
  
  return newScheme;
}

/**
 * Gets a scheme by ID from the configuration
 * @param config - Color schemes configuration
 * @param schemeId - ID of the scheme to retrieve
 * @returns Color scheme or undefined if not found
 */
export function getSchemeById(
  config: ColorSchemesConfig,
  schemeId: string
): ColorScheme | undefined {
  return config.schemes.find(scheme => scheme.id === schemeId);
}

/**
 * Gets the active color scheme
 * @param config - Color schemes configuration
 * @returns Active color scheme or first scheme if default not found
 */
export function getActiveScheme(config: ColorSchemesConfig): ColorScheme {
  return getSchemeById(config, config.defaultScheme) || config.schemes[0];
}