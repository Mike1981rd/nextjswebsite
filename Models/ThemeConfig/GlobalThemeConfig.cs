using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebsiteBuilderAPI.Models.ThemeConfig
{
    /// <summary>
    /// Complete global theme configuration for a company website
    /// Stored as JSONB in PostgreSQL for flexibility and performance
    /// Replaces the monolithic 24,000-line JSON from v1
    /// </summary>
    [Table("GlobalThemeConfigs")]
    public class GlobalThemeConfig
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Company ID this configuration belongs to
        /// One company = one configuration (no multiple themes)
        /// </summary>
        [Required]
        public int CompanyId { get; set; }

        /// <summary>
        /// Reference to the company
        /// </summary>
        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }

        /// <summary>
        /// Page appearance settings
        /// </summary>
        [Column(TypeName = "jsonb")]
        public AppearanceConfig Appearance { get; set; }

        /// <summary>
        /// Typography settings for different text types
        /// </summary>
        [Column(TypeName = "jsonb")]
        public TypographyConfig Typography { get; set; }

        /// <summary>
        /// Color schemes (up to 5)
        /// </summary>
        [Column(TypeName = "jsonb")]
        public ColorSchemesConfig ColorSchemes { get; set; }

        /// <summary>
        /// Product card display settings
        /// </summary>
        [Column(TypeName = "jsonb")]
        public ProductCardsConfig ProductCards { get; set; }

        /// <summary>
        /// Product badge settings
        /// </summary>
        [Column(TypeName = "jsonb")]
        public ProductBadgesConfig ProductBadges { get; set; }

        /// <summary>
        /// Shopping cart configuration
        /// </summary>
        [Column(TypeName = "jsonb")]
        public CartConfig Cart { get; set; }

        /// <summary>
        /// Favicon settings
        /// </summary>
        [Column(TypeName = "jsonb")]
        public FaviconConfig Favicon { get; set; }

        /// <summary>
        /// Navigation and search settings
        /// </summary>
        [Column(TypeName = "jsonb")]
        public NavigationConfig Navigation { get; set; }

        /// <summary>
        /// Social media links
        /// </summary>
        [Column(TypeName = "jsonb")]
        public SocialMediaConfig SocialMedia { get; set; }

        /// <summary>
        /// Product variant swatches
        /// </summary>
        [Column(TypeName = "jsonb")]
        public SwatchesConfig Swatches { get; set; }

        /// <summary>
        /// Version of the configuration schema
        /// Used for migrations and compatibility
        /// </summary>
        [Required]
        public string ConfigVersion { get; set; } = "2.0.0";

        /// <summary>
        /// When this configuration was created
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// When this configuration was last updated
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Whether this configuration is published/active
        /// </summary>
        public bool IsPublished { get; set; } = false;

        /// <summary>
        /// When this configuration was published
        /// </summary>
        public DateTime? PublishedAt { get; set; }
    }

    #region Appearance Configuration
    public class AppearanceConfig
    {
        public int PageWidth { get; set; } = 2300;
        public int LateralPadding { get; set; } = 31;
        public string BorderRadius { get; set; } = "size-2";
    }
    #endregion

    #region Typography Configuration
    public class TypographyConfig
    {
        public FontConfig Heading1 { get; set; }
        public FontConfig Heading2 { get; set; }
        public FontConfig Body { get; set; }
        public FontConfig Button { get; set; }
        public FontConfig Link { get; set; }
    }

    public class FontConfig
    {
        public string FontFamily { get; set; }
        public int FontSize { get; set; }
        public string FontWeight { get; set; }
        public float LineHeight { get; set; }
        public int LetterSpacing { get; set; }
    }
    #endregion

    #region Color Schemes Configuration
    public class ColorSchemesConfig
    {
        public string DefaultScheme { get; set; } = "scheme-1";
        public List<ColorScheme> Schemes { get; set; } = new List<ColorScheme>();
    }

    public class ColorScheme
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public string Background { get; set; }
        public string Foreground { get; set; }
        public string Border { get; set; }
        public string Link { get; set; }
        public string SolidButton { get; set; }
        public string SolidButtonText { get; set; }
        public string OutlineButton { get; set; }
        public string OutlineButtonText { get; set; }
        public string ImageOverlay { get; set; }
    }
    #endregion

    #region Product Cards Configuration
    public class ProductCardsConfig
    {
        public ProductImageConfig Image { get; set; }
        public ProductVisibilityConfig Visibility { get; set; }
        public ProductRatingConfig Rating { get; set; }
        public ProductPriceConfig Price { get; set; }
        public ProductEffectsConfig Effects { get; set; }
        public ProductSwatchesConfig Swatches { get; set; }
        public ProductButtonsConfig Buttons { get; set; }
    }

    public class ProductImageConfig
    {
        public string DefaultRatio { get; set; } = "square-1-1-fill";
    }

    public class ProductVisibilityConfig
    {
        public bool ShowVendor { get; set; }
        public bool ShowCurrencyCode { get; set; }
        public bool ShowColorCount { get; set; }
        public bool ColorizeCardBackground { get; set; }
        public bool DarkenImageBackground { get; set; }
    }

    public class ProductRatingConfig
    {
        public string ProductRating { get; set; } = "average-and-stars";
    }

    public class ProductPriceConfig
    {
        public string LabelSize { get; set; } = "large";
    }

    public class ProductEffectsConfig
    {
        public string HoverEffect { get; set; } = "none";
    }

    public class ProductSwatchesConfig
    {
        public string WhatToShow { get; set; } = "color-swatches";
        public string ShowOnDesktop { get; set; } = "on-hover";
        public string ShowOnMobile { get; set; } = "always";
        public bool HideForSingleColor { get; set; } = true;
    }

    public class ProductButtonsConfig
    {
        public bool QuickBuy { get; set; }
        public bool ShowQuickView { get; set; }
        public bool ShowAddToCart { get; set; }
        public string DesktopStyle { get; set; } = "labels";
        public bool ShowOnHover { get; set; } = true;
    }
    #endregion

    #region Product Badges Configuration
    public class ProductBadgesConfig
    {
        public BadgeConfig Sale { get; set; }
        public BadgeConfig SoldOut { get; set; }
        public BadgeConfig NewProduct { get; set; }
        public BadgeConfig ComingSoon { get; set; }
        public BadgeConfig LimitedEdition { get; set; }
        public BadgeConfig Exclusive { get; set; }
        public BadgeConfig Custom { get; set; }
    }

    public class BadgeConfig
    {
        public bool Enabled { get; set; }
        public string Label { get; set; }
        public string BackgroundColor { get; set; }
        public string TextColor { get; set; }
        public string Position { get; set; }
        public string Shape { get; set; }
        public string CustomText { get; set; }
    }
    #endregion

    #region Cart Configuration
    public class CartConfig
    {
        public string DrawerType { get; set; } = "overlay";
        public FreeShippingConfig FreeShipping { get; set; }
    }

    public class FreeShippingConfig
    {
        public bool ShowProgress { get; set; } = true;
        public decimal Threshold { get; set; } = 50.00m;
        public string ProgressBarColor { get; set; } = "#28a745";
        public string SuccessMessage { get; set; } = "¡Envío gratis conseguido!";
        public string ProgressMessage { get; set; } = "Te faltan {amount} para envío gratis";
    }
    #endregion

    #region Favicon Configuration
    public class FaviconConfig
    {
        public bool CustomFavicon { get; set; } = true;
        public string FaviconUrl { get; set; } = "/favicon-custom.ico";
    }
    #endregion

    #region Navigation Configuration
    public class NavigationConfig
    {
        public SearchConfig Search { get; set; }
        public BackToTopConfig BackToTop { get; set; }
    }

    public class SearchConfig
    {
        public string ShowAs { get; set; } = "drawer-only";
    }

    public class BackToTopConfig
    {
        public bool ShowButton { get; set; } = true;
        public string Position { get; set; } = "bottom-center";
    }
    #endregion

    #region Social Media Configuration
    public class SocialMediaConfig
    {
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Instagram { get; set; }
        public string Youtube { get; set; }
        public string Pinterest { get; set; }
        public string Tiktok { get; set; }
        public string Tumblr { get; set; }
        public string Snapchat { get; set; }
        public string Vimeo { get; set; }
        public string Flickr { get; set; }
        public string Reddit { get; set; }
        public string Whatsapp { get; set; }
        public string Wechat { get; set; }
        public string Discord { get; set; }
        public string Linkedin { get; set; }
        public string Medium { get; set; }
        public string Telegram { get; set; }
    }
    #endregion

    #region Swatches Configuration
    public class SwatchesConfig
    {
        public SwatchDisplayConfig ColorSwatches { get; set; }
        public SwatchDisplayConfig SizeSwatches { get; set; }
        public SwatchDisplayConfig MaterialSwatches { get; set; }
        public bool GroupByType { get; set; } = true;
        public bool ShowUnavailable { get; set; } = true;
        public string NoSwatchesText { get; set; } = "No hay opciones disponibles";
    }

    public class SwatchDisplayConfig
    {
        public string Shape { get; set; }
        public string Size { get; set; }
        public bool ShowBorder { get; set; }
        public string BorderColor { get; set; }
        public bool ShowTooltip { get; set; }
        public bool ShowCheckmark { get; set; }
        public int? MaxVisible { get; set; }
    }
    #endregion
}