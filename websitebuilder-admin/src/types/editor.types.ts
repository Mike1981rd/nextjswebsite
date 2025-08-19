// Types for the Website Builder Editor

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  visible: boolean;
  settings: Record<string, any>;
  sortOrder: number;
}

export enum SectionType {
  // Header Group
  ANNOUNCEMENT_BAR = 'announcement_bar',
  HEADER = 'header',
  IMAGE_BANNER = 'image_banner',
  
  // Aside Group
  CART_DRAWER = 'cart_drawer',
  SEARCH_DRAWER = 'search_drawer',
  
  // Template Sections
  SLIDESHOW = 'slideshow',
  MULTICOLUMNS = 'multicolumns',
  COLLAGE = 'collage',
  IMAGE_WITH_TEXT = 'image_with_text',
  GALLERY = 'gallery',
  CONTACT_FORM = 'contact_form',
  NEWSLETTER = 'newsletter',
  FEATURED_PRODUCT = 'featured_product',
  FEATURED_COLLECTION = 'featured_collection',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq',
  VIDEOS = 'videos',
  RICH_TEXT = 'rich_text',
  
  // Footer Group
  FOOTER = 'footer',
  
  // Product Page Specific
  PRODUCT_INFORMATION = 'product_information'
}

export interface SectionGroup {
  id: string;
  name: string;
  sections: Section[];
  isCollapsed: boolean;
  canAddSections: boolean;
}

export interface EditorState {
  selectedPageId: string | null;
  selectedPageType: PageType | null;
  sections: {
    headerGroup: Section[];
    asideGroup: Section[];
    template: Section[];
    footerGroup: Section[];
  };
  selectedSectionId: string | null;
  isConfigPanelOpen: boolean;
  hoveredSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
}

export enum PageType {
  HOME = 'home',
  PRODUCT = 'product',
  CART = 'cart',
  CHECKOUT = 'checkout',
  COLLECTION = 'collection',
  ALL_COLLECTIONS = 'all_collections',
  ALL_PRODUCTS = 'all_products',
  CUSTOM = 'custom'
}

export interface Page {
  id: string;
  name: string;
  type: PageType;
  slug: string;
  isActive: boolean;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface SectionConfig {
  type: SectionType;
  name: string;
  description: string;
  icon: string;
  category: 'header' | 'aside' | 'template' | 'footer';
  defaultSettings: Record<string, any>;
}

export const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  [SectionType.ANNOUNCEMENT_BAR]: {
    type: SectionType.ANNOUNCEMENT_BAR,
    name: 'Announcement bar',
    description: 'Display important messages at the top',
    icon: 'megaphone',
    category: 'header',
    defaultSettings: {
      text: 'Welcome to our store!',
      backgroundColor: '#000000',
      textColor: '#ffffff'
    }
  },
  [SectionType.HEADER]: {
    type: SectionType.HEADER,
    name: 'Header',
    description: 'Main navigation header',
    icon: 'layout-navbar',
    category: 'header',
    defaultSettings: {
      logo: null,
      menuItems: []
    }
  },
  [SectionType.IMAGE_BANNER]: {
    type: SectionType.IMAGE_BANNER,
    name: 'Image banner',
    description: 'Hero banner with text overlay',
    icon: 'image',
    category: 'header',
    defaultSettings: {
      image: null,
      title: '',
      subtitle: '',
      buttonText: '',
      buttonUrl: ''
    }
  },
  [SectionType.CART_DRAWER]: {
    type: SectionType.CART_DRAWER,
    name: 'Cart drawer',
    description: 'Shopping cart side panel',
    icon: 'shopping-cart',
    category: 'aside',
    defaultSettings: {
      position: 'right'
    }
  },
  [SectionType.SEARCH_DRAWER]: {
    type: SectionType.SEARCH_DRAWER,
    name: 'Search drawer',
    description: 'Search functionality panel',
    icon: 'search',
    category: 'aside',
    defaultSettings: {
      position: 'right'
    }
  },
  [SectionType.SLIDESHOW]: {
    type: SectionType.SLIDESHOW,
    name: 'Slideshow',
    description: 'Image carousel with text',
    icon: 'images',
    category: 'template',
    defaultSettings: {
      slides: [],
      autoplay: true,
      duration: 5000
    }
  },
  [SectionType.MULTICOLUMNS]: {
    type: SectionType.MULTICOLUMNS,
    name: 'Multicolumns',
    description: 'Multiple columns with icons',
    icon: 'columns-3',
    category: 'template',
    defaultSettings: {
      enabled: true,
      colorScheme: '1',
      width: 'large',
      desktopLayout: 'grid',
      mobileLayout: '1column',
      heading: 'Multicolumn',
      body: '',
      headingSize: 1.0,
      bodySize: 1.0,
      contentAlignment: 'left',
      columnsHeadingSize: 1.0,
      columnsBodySize: 1.0,
      desktopCardsPerRow: 3,
      desktopSpaceBetweenCards: 24,
      desktopSpacing: 24,
      mobileSpaceBetweenCards: 16,
      mobileSpacing: 24,
      colorColumns: false,
      showArrowsOnHover: false,
      buttonLabel: '',
      buttonLink: '',
      buttonStyle: 'solid',
      autoplay: 'none',
      autoplaySpeed: 3000,
      addSidePaddings: false,
      topPadding: 0,
      bottomPadding: 0,
      containerHeight: 0,
      customCSS: '',
      items: [
        {
          id: `item_${Date.now()}`,
          type: 'icon',
          visible: true,
          icon: 'star',
          iconSize: 64,
          heading: 'Icon column',
          body: 'Pair text with an icon to focus on your chosen product, collection or piece of news.',
          linkLabel: '',
          link: ''
        },
        {
          id: `item_${Date.now() + 1}`,
          type: 'icon',
          visible: true,
          icon: 'truck',
          iconSize: 64,
          heading: 'Icon column',
          body: 'Pair text with an icon to focus on your chosen product, collection or piece of news.',
          linkLabel: '',
          link: ''
        },
        {
          id: `item_${Date.now() + 2}`,
          type: 'icon',
          visible: true,
          icon: 'gift',
          iconSize: 64,
          heading: 'Icon column',
          body: 'Pair text with an icon to focus on your chosen product, collection or piece of news.',
          linkLabel: '',
          link: ''
        }
      ]
    }
  },
  [SectionType.COLLAGE]: {
    type: SectionType.COLLAGE,
    name: 'Collage',
    description: 'Grid of images',
    icon: 'layout-grid',
    category: 'template',
    defaultSettings: {
      images: [],
      layout: 'grid'
    }
  },
  [SectionType.IMAGE_WITH_TEXT]: {
    type: SectionType.IMAGE_WITH_TEXT,
    name: 'Image with text',
    description: 'Image alongside text content',
    icon: 'layout',
    category: 'template',
    defaultSettings: {
      enabled: true,
      colorScheme: '1',
      width: 'medium',
      contentLayout: 'left',
      imageLayout: 'grid',
      imageRatio: 1,
      rotateImages: false,
      icon: '',
      subheading: '',
      heading: 'Image with text',
      body: 'Pair text with an image to focus on your chosen product, collection, or blog post.',
      headingSize: 36,
      bodySize: 16,
      contentAlignment: 'left',
      desktopWidth: 400,
      firstButtonLabel: '',
      firstButtonLink: '',
      firstButtonStyle: 'solid',
      secondButtonLabel: '',
      secondButtonLink: '',
      secondButtonStyle: 'outline',
      addSidePaddings: true,
      topPadding: 40,
      bottomPadding: 40,
      items: []
    }
  },
  [SectionType.GALLERY]: {
    type: SectionType.GALLERY,
    name: 'Gallery',
    description: 'Photo gallery grid',
    icon: 'gallery-horizontal',
    category: 'template',
    defaultSettings: {
      images: [],
      columns: 3
    }
  },
  [SectionType.CONTACT_FORM]: {
    type: SectionType.CONTACT_FORM,
    name: 'Contact form',
    description: 'Contact form with fields',
    icon: 'mail',
    category: 'template',
    defaultSettings: {
      title: 'Contact Us',
      fields: []
    }
  },
  [SectionType.NEWSLETTER]: {
    type: SectionType.NEWSLETTER,
    name: 'Newsletter',
    description: 'Email subscription form',
    icon: 'newspaper',
    category: 'template',
    defaultSettings: {
      title: 'Subscribe to our newsletter',
      subtitle: ''
    }
  },
  [SectionType.FEATURED_PRODUCT]: {
    type: SectionType.FEATURED_PRODUCT,
    name: 'Featured product',
    description: 'Highlight a single product',
    icon: 'star',
    category: 'template',
    defaultSettings: {
      productId: null
    }
  },
  [SectionType.FEATURED_COLLECTION]: {
    type: SectionType.FEATURED_COLLECTION,
    name: 'Featured collection',
    description: 'Display a product collection',
    icon: 'folder-open',
    category: 'template',
    defaultSettings: {
      collectionId: null,
      limit: 4
    }
  },
  [SectionType.TESTIMONIALS]: {
    type: SectionType.TESTIMONIALS,
    name: 'Testimonials',
    description: 'Customer reviews and testimonials',
    icon: 'message-circle',
    category: 'template',
    defaultSettings: {
      enabled: true,
      colorScheme: '1',
      colorBackground: false,
      colorTestimonials: false,
      width: 'page',
      desktopLayout: 'bottom-carousel',
      mobileLayout: 'slideshow',
      desktopCardsPerRow: 2,
      desktopSpaceBetweenCards: 16,
      desktopContentAlignment: 'left',
      mobileContentAlignment: 'left',
      showRating: true,
      ratingStarsColor: '#FAA613',
      subheading: 'TESTIMONIALS',
      heading: 'Customer stories',
      headingSize: 'heading_3',
      body: 'Show customer reviews: tweets, blog posts, or interviews. Invite customers to share their impressions of your products.',
      bodySize: 'body_3',
      overlayOpacity: 20,
      imageSize: 100,
      autoplay: 'none',
      autoplayMode: 'none',
      autoplaySpeed: 3,
      addSidePaddings: true,
      topPadding: 96,
      bottomPadding: 30,
      items: []
    }
  },
  [SectionType.FAQ]: {
    type: SectionType.FAQ,
    name: 'FAQ',
    description: 'Frequently asked questions',
    icon: 'help-circle',
    category: 'template',
    defaultSettings: {
      enabled: true,
      colorScheme: '1',
      colorBackground: false,
      colorTabs: 'categories',
      width: 'page',
      layout: 'tabs_bottom',
      expandFirstTab: false,
      heading: 'Preguntas Frecuentes',
      body: '',
      headingSize: 'heading_3',
      bodySize: 'body_3',
      headingWeight: 'bold',
      bodyWeight: 'normal',
      collapserStyle: 'plus_minus',
      addSidePaddings: false,
      topPadding: 96,
      bottomPadding: 96,
      items: []
    }
  },
  [SectionType.VIDEOS]: {
    type: SectionType.VIDEOS,
    name: 'Videos',
    description: 'Embed videos',
    icon: 'video',
    category: 'template',
    defaultSettings: {
      videoUrl: ''
    }
  },
  [SectionType.RICH_TEXT]: {
    type: SectionType.RICH_TEXT,
    name: 'Rich text',
    description: 'Formatted text content',
    icon: 'text',
    category: 'template',
    defaultSettings: {
      content: ''
    }
  },
  [SectionType.FOOTER]: {
    type: SectionType.FOOTER,
    name: 'Footer',
    description: 'Site footer',
    icon: 'layout-navbar-collapse',
    category: 'footer',
    defaultSettings: {
      columns: [],
      copyright: ''
    }
  },
  [SectionType.PRODUCT_INFORMATION]: {
    type: SectionType.PRODUCT_INFORMATION,
    name: 'Product information',
    description: 'Product details and buy button',
    icon: 'package',
    category: 'template',
    defaultSettings: {
      showPrice: true,
      showDescription: true,
      showVariants: true
    }
  }
};