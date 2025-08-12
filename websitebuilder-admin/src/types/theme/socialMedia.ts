/**
 * Social Media Configuration Module
 * Manages links for 17 different social media platforms
 * Part of the modular theme system to avoid monolithic JSON
 */

/**
 * Social media configuration with support for 17 platforms
 */
export interface SocialMediaConfig {
  /** Facebook profile/page URL */
  facebook?: string;
  
  /** Twitter/X profile URL */
  twitter?: string;
  
  /** Instagram profile URL */
  instagram?: string;
  
  /** YouTube channel URL */
  youtube?: string;
  
  /** Pinterest profile URL */
  pinterest?: string;
  
  /** TikTok profile URL */
  tiktok?: string;
  
  /** Tumblr blog URL */
  tumblr?: string;
  
  /** Snapchat profile URL */
  snapchat?: string;
  
  /** Vimeo profile URL */
  vimeo?: string;
  
  /** Flickr profile URL */
  flickr?: string;
  
  /** Reddit profile/subreddit URL */
  reddit?: string;
  
  /** WhatsApp number or link */
  whatsapp?: string;
  
  /** WeChat ID or link */
  wechat?: string;
  
  /** Discord server invite URL */
  discord?: string;
  
  /** LinkedIn company/profile URL */
  linkedin?: string;
  
  /** Medium publication/profile URL */
  medium?: string;
  
  /** Telegram channel/group URL */
  telegram?: string;
}

/**
 * Default social media configuration
 * Based on specifications from prompt.pdf
 */
export const defaultSocialMedia: SocialMediaConfig = {
  facebook: 'https://facebook.com/jacarandaplaza',
  instagram: 'https://instagram.com/jacarandaplaza'
};

/**
 * Social media platform metadata
 */
export interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  urlPattern?: RegExp;
}

/**
 * Social media platforms information
 */
export const socialPlatforms: Record<keyof SocialMediaConfig, SocialPlatform> = {
  facebook: {
    name: 'Facebook',
    icon: 'fab fa-facebook-f',
    color: '#1877F2',
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/.+$/
  },
  twitter: {
    name: 'X (Twitter)',
    icon: 'fab fa-x-twitter',
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?(twitter|x)\.com\/.+$/
  },
  instagram: {
    name: 'Instagram',
    icon: 'fab fa-instagram',
    color: '#E4405F',
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/.+$/
  },
  youtube: {
    name: 'YouTube',
    icon: 'fab fa-youtube',
    color: '#FF0000',
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/.+$/
  },
  pinterest: {
    name: 'Pinterest',
    icon: 'fab fa-pinterest-p',
    color: '#BD081C',
    urlPattern: /^https?:\/\/(www\.)?pinterest\.com\/.+$/
  },
  tiktok: {
    name: 'TikTok',
    icon: 'fab fa-tiktok',
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/.+$/
  },
  tumblr: {
    name: 'Tumblr',
    icon: 'fab fa-tumblr',
    color: '#35465C',
    urlPattern: /^https?:\/\/.+\.tumblr\.com$/
  },
  snapchat: {
    name: 'Snapchat',
    icon: 'fab fa-snapchat-ghost',
    color: '#FFFC00',
    urlPattern: /^https?:\/\/(www\.)?snapchat\.com\/.+$/
  },
  vimeo: {
    name: 'Vimeo',
    icon: 'fab fa-vimeo-v',
    color: '#1AB7EA',
    urlPattern: /^https?:\/\/(www\.)?vimeo\.com\/.+$/
  },
  flickr: {
    name: 'Flickr',
    icon: 'fab fa-flickr',
    color: '#0063DC',
    urlPattern: /^https?:\/\/(www\.)?flickr\.com\/.+$/
  },
  reddit: {
    name: 'Reddit',
    icon: 'fab fa-reddit-alien',
    color: '#FF4500',
    urlPattern: /^https?:\/\/(www\.)?reddit\.com\/.+$/
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: 'fab fa-whatsapp',
    color: '#25D366',
    urlPattern: /^https?:\/\/(wa\.me|api\.whatsapp\.com)\/.+$/
  },
  wechat: {
    name: 'WeChat',
    icon: 'fab fa-weixin',
    color: '#7BB32E',
    urlPattern: undefined // WeChat uses QR codes or IDs
  },
  discord: {
    name: 'Discord',
    icon: 'fab fa-discord',
    color: '#5865F2',
    urlPattern: /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/.+$/
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'fab fa-linkedin-in',
    color: '#0A66C2',
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/.+$/
  },
  medium: {
    name: 'Medium',
    icon: 'fab fa-medium-m',
    color: '#000000',
    urlPattern: /^https?:\/\/(www\.)?medium\.com\/.+$/
  },
  telegram: {
    name: 'Telegram',
    icon: 'fab fa-telegram-plane',
    color: '#0088CC',
    urlPattern: /^https?:\/\/(t\.me|telegram\.me)\/.+$/
  }
};

/**
 * Validates a social media URL
 * @param platform - Platform key
 * @param url - URL to validate
 * @returns true if valid or no pattern defined, false otherwise
 */
export function validateSocialMediaUrl(
  platform: keyof SocialMediaConfig,
  url: string
): boolean {
  if (!url || url.trim() === '') {
    return false;
  }
  
  const platformInfo = socialPlatforms[platform];
  if (!platformInfo.urlPattern) {
    // If no pattern defined, just check if it's a valid URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  return platformInfo.urlPattern.test(url);
}

/**
 * Gets active social media platforms
 * @param config - Social media configuration
 * @returns Array of active platform keys
 */
export function getActivePlatforms(config: SocialMediaConfig): Array<keyof SocialMediaConfig> {
  return (Object.keys(config) as Array<keyof SocialMediaConfig>)
    .filter(key => config[key] && config[key]!.trim() !== '');
}

/**
 * Validates entire social media configuration
 * @param config - Social media configuration to validate
 * @returns Object with validation results
 */
export function validateSocialMediaConfig(config: Partial<SocialMediaConfig>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  for (const [platform, url] of Object.entries(config)) {
    if (url && !validateSocialMediaUrl(platform as keyof SocialMediaConfig, url)) {
      errors[platform] = `Invalid URL for ${socialPlatforms[platform as keyof SocialMediaConfig].name}`;
      isValid = false;
    }
  }
  
  return { isValid, errors };
}

/**
 * Merges partial social media configuration with defaults
 * @param partial - Partial configuration to merge
 * @returns Complete social media configuration
 */
export function mergeSocialMediaWithDefaults(
  partial: Partial<SocialMediaConfig>
): SocialMediaConfig {
  return {
    ...defaultSocialMedia,
    ...partial
  };
}