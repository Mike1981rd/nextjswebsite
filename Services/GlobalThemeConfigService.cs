using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.Models.ThemeConfig;

namespace WebsiteBuilderAPI.Services
{
    /// <summary>
    /// Service implementation for managing global theme configurations
    /// Uses caching for performance and modular updates to avoid large JSON transfers
    /// </summary>
    public class GlobalThemeConfigService : IGlobalThemeConfigService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<GlobalThemeConfigService> _logger;
        private const string CACHE_KEY_PREFIX = "ThemeConfig_";
        private readonly TimeSpan CACHE_DURATION = TimeSpan.FromMinutes(30);

        public GlobalThemeConfigService(
            ApplicationDbContext context,
            IMemoryCache cache,
            ILogger<GlobalThemeConfigService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<GlobalThemeConfig> GetByCompanyIdAsync(int companyId)
        {
            var cacheKey = $"{CACHE_KEY_PREFIX}{companyId}";
            
            if (_cache.TryGetValue(cacheKey, out GlobalThemeConfig cachedConfig))
            {
                _logger.LogDebug("Theme config retrieved from cache for company {CompanyId}", companyId);
                return cachedConfig;
            }

            var config = await _context.GlobalThemeConfigs
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);

            if (config == null)
            {
                _logger.LogInformation("Creating default theme config for company {CompanyId}", companyId);
                config = await CreateDefaultConfigAsync(companyId);
            }

            _cache.Set(cacheKey, config, CACHE_DURATION);
            return config;
        }

        public async Task<AppearanceConfig> GetAppearanceAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Appearance;
        }

        public async Task<TypographyConfig> GetTypographyAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Typography;
        }

        public async Task<ColorSchemesConfig> GetColorSchemesAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.ColorSchemes;
        }

        public async Task<ProductCardsConfig> GetProductCardsAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.ProductCards;
        }

        public async Task<ProductBadgesConfig> GetProductBadgesAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.ProductBadges;
        }

        public async Task<CartConfig> GetCartAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Cart;
        }

        public async Task<FaviconConfig> GetFaviconAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Favicon;
        }

        public async Task<NavigationConfig> GetNavigationAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Navigation;
        }

        public async Task<SocialMediaConfig> GetSocialMediaAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.SocialMedia;
        }

        public async Task<SwatchesConfig> GetSwatchesAsync(int companyId)
        {
            var config = await GetByCompanyIdAsync(companyId);
            return config.Swatches;
        }

        public async Task<GlobalThemeConfig> UpdateAsync(int companyId, GlobalThemeConfig config)
        {
            var existingConfig = await _context.GlobalThemeConfigs
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);

            if (existingConfig == null)
            {
                throw new InvalidOperationException($"Theme config not found for company {companyId}");
            }

            // Update all modules
            existingConfig.Appearance = config.Appearance;
            existingConfig.Typography = config.Typography;
            existingConfig.ColorSchemes = config.ColorSchemes;
            existingConfig.ProductCards = config.ProductCards;
            existingConfig.ProductBadges = config.ProductBadges;
            existingConfig.Cart = config.Cart;
            existingConfig.Favicon = config.Favicon;
            existingConfig.Navigation = config.Navigation;
            existingConfig.SocialMedia = config.SocialMedia;
            existingConfig.Swatches = config.Swatches;
            existingConfig.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            // Invalidate cache
            _cache.Remove($"{CACHE_KEY_PREFIX}{companyId}");
            
            _logger.LogInformation("Theme config updated for company {CompanyId}", companyId);
            return existingConfig;
        }

        public async Task<AppearanceConfig> UpdateAppearanceAsync(int companyId, AppearanceConfig appearance)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Appearance = appearance;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Appearance config updated for company {CompanyId}", companyId);
            return appearance;
        }

        public async Task<TypographyConfig> UpdateTypographyAsync(int companyId, TypographyConfig typography)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Typography = typography;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Typography config updated for company {CompanyId}", companyId);
            return typography;
        }

        public async Task<ColorSchemesConfig> UpdateColorSchemesAsync(int companyId, ColorSchemesConfig colorSchemes)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.ColorSchemes = colorSchemes;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Color schemes updated for company {CompanyId}", companyId);
            return colorSchemes;
        }

        public async Task<ProductCardsConfig> UpdateProductCardsAsync(int companyId, ProductCardsConfig productCards)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.ProductCards = productCards;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Product cards config updated for company {CompanyId}", companyId);
            return productCards;
        }

        public async Task<ProductBadgesConfig> UpdateProductBadgesAsync(int companyId, ProductBadgesConfig productBadges)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.ProductBadges = productBadges;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Product badges config updated for company {CompanyId}", companyId);
            return productBadges;
        }

        public async Task<CartConfig> UpdateCartAsync(int companyId, CartConfig cart)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Cart = cart;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Cart config updated for company {CompanyId}", companyId);
            return cart;
        }

        public async Task<FaviconConfig> UpdateFaviconAsync(int companyId, FaviconConfig favicon)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Favicon = favicon;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Favicon config updated for company {CompanyId}", companyId);
            return favicon;
        }

        public async Task<NavigationConfig> UpdateNavigationAsync(int companyId, NavigationConfig navigation)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Navigation = navigation;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Navigation config updated for company {CompanyId}", companyId);
            return navigation;
        }

        public async Task<SocialMediaConfig> UpdateSocialMediaAsync(int companyId, SocialMediaConfig socialMedia)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.SocialMedia = socialMedia;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Social media config updated for company {CompanyId}", companyId);
            return socialMedia;
        }

        public async Task<SwatchesConfig> UpdateSwatchesAsync(int companyId, SwatchesConfig swatches)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.Swatches = swatches;
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Swatches config updated for company {CompanyId}", companyId);
            return swatches;
        }

        public async Task<bool> PublishAsync(int companyId)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            config.IsPublished = true;
            config.PublishedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Theme config published for company {CompanyId}", companyId);
            return true;
        }

        public async Task<GlobalThemeConfig> CreateDraftAsync(int companyId)
        {
            var currentConfig = await GetByCompanyIdAsync(companyId);
            
            // Create a copy with IsPublished = false
            var draft = new GlobalThemeConfig
            {
                CompanyId = companyId,
                Appearance = currentConfig.Appearance,
                Typography = currentConfig.Typography,
                ColorSchemes = currentConfig.ColorSchemes,
                ProductCards = currentConfig.ProductCards,
                ProductBadges = currentConfig.ProductBadges,
                Cart = currentConfig.Cart,
                Favicon = currentConfig.Favicon,
                Navigation = currentConfig.Navigation,
                SocialMedia = currentConfig.SocialMedia,
                Swatches = currentConfig.Swatches,
                IsPublished = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _logger.LogInformation("Draft theme config created for company {CompanyId}", companyId);
            return draft;
        }

        public async Task<bool> ResetModuleToDefaultAsync(int companyId, string moduleName)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            
            switch (moduleName.ToLower())
            {
                case "appearance":
                    config.Appearance = GetDefaultAppearance();
                    break;
                case "typography":
                    config.Typography = GetDefaultTypography();
                    break;
                case "colorschemes":
                    config.ColorSchemes = GetDefaultColorSchemes();
                    break;
                case "productcards":
                    config.ProductCards = GetDefaultProductCards();
                    break;
                case "productbadges":
                    config.ProductBadges = GetDefaultProductBadges();
                    break;
                case "cart":
                    config.Cart = GetDefaultCart();
                    break;
                case "favicon":
                    config.Favicon = GetDefaultFavicon();
                    break;
                case "navigation":
                    config.Navigation = GetDefaultNavigation();
                    break;
                case "socialmedia":
                    config.SocialMedia = GetDefaultSocialMedia();
                    break;
                case "swatches":
                    config.Swatches = GetDefaultSwatches();
                    break;
                default:
                    return false;
            }
            
            config.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("Module {ModuleName} reset to default for company {CompanyId}", moduleName, companyId);
            return true;
        }

        public async Task<GlobalThemeConfig> ResetAllToDefaultAsync(int companyId)
        {
            var config = await GetConfigForUpdateAsync(companyId);
            
            config.Appearance = GetDefaultAppearance();
            config.Typography = GetDefaultTypography();
            config.ColorSchemes = GetDefaultColorSchemes();
            config.ProductCards = GetDefaultProductCards();
            config.ProductBadges = GetDefaultProductBadges();
            config.Cart = GetDefaultCart();
            config.Favicon = GetDefaultFavicon();
            config.Navigation = GetDefaultNavigation();
            config.SocialMedia = GetDefaultSocialMedia();
            config.Swatches = GetDefaultSwatches();
            config.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            InvalidateCache(companyId);
            
            _logger.LogInformation("All theme config reset to default for company {CompanyId}", companyId);
            return config;
        }

        public async Task<bool> ValidateCompanyAccessAsync(int companyId, int userId)
        {
            // TODO: Implement proper permission checking
            var company = await _context.Companies.FindAsync(companyId);
            return company != null;
        }

        #region Private Helper Methods

        private async Task<GlobalThemeConfig> GetConfigForUpdateAsync(int companyId)
        {
            var config = await _context.GlobalThemeConfigs
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);
                
            if (config == null)
            {
                throw new InvalidOperationException($"Theme config not found for company {companyId}");
            }
            
            return config;
        }

        private void InvalidateCache(int companyId)
        {
            _cache.Remove($"{CACHE_KEY_PREFIX}{companyId}");
        }

        private async Task<GlobalThemeConfig> CreateDefaultConfigAsync(int companyId)
        {
            var config = new GlobalThemeConfig
            {
                CompanyId = companyId,
                Appearance = GetDefaultAppearance(),
                Typography = GetDefaultTypography(),
                ColorSchemes = GetDefaultColorSchemes(),
                ProductCards = GetDefaultProductCards(),
                ProductBadges = GetDefaultProductBadges(),
                Cart = GetDefaultCart(),
                Favicon = GetDefaultFavicon(),
                Navigation = GetDefaultNavigation(),
                SocialMedia = GetDefaultSocialMedia(),
                Swatches = GetDefaultSwatches(),
                ConfigVersion = "2.0.0",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsPublished = false
            };

            _context.GlobalThemeConfigs.Add(config);
            await _context.SaveChangesAsync();
            
            return config;
        }

        #region Default Configurations

        private AppearanceConfig GetDefaultAppearance() => new AppearanceConfig
        {
            PageWidth = 2300,
            LateralPadding = 31,
            BorderRadius = "size-2"
        };

        private TypographyConfig GetDefaultTypography() => new TypographyConfig
        {
            Heading1 = new FontConfig 
            { 
                FontFamily = "Poppins", 
                FontSize = 40, 
                FontWeight = "600", 
                LineHeight = 1.2f, 
                LetterSpacing = 0 
            },
            Heading2 = new FontConfig 
            { 
                FontFamily = "Poppins", 
                FontSize = 24, 
                FontWeight = "600", 
                LineHeight = 1.3f, 
                LetterSpacing = 0 
            },
            Body = new FontConfig 
            { 
                FontFamily = "Montserrat", 
                FontSize = 16, 
                FontWeight = "400", 
                LineHeight = 1.5f, 
                LetterSpacing = 0 
            },
            Button = new FontConfig 
            { 
                FontFamily = "Montserrat", 
                FontSize = 16, 
                FontWeight = "600", 
                LineHeight = 1.2f, 
                LetterSpacing = 1 
            },
            Link = new FontConfig 
            { 
                FontFamily = "Montserrat", 
                FontSize = 16, 
                FontWeight = "400", 
                LineHeight = 1.5f, 
                LetterSpacing = 0 
            }
        };

        private ColorSchemesConfig GetDefaultColorSchemes() => new ColorSchemesConfig
        {
            DefaultScheme = "scheme-1",
            Schemes = new List<ColorScheme>
            {
                new ColorScheme
                {
                    Id = "scheme-1",
                    Name = "Esquema 1",
                    Text = "#000000",
                    Background = "#FFFFFF",
                    Foreground = "#F5E076",
                    Border = "#000000",
                    Link = "#F74703",
                    SolidButton = "#F74703",
                    SolidButtonText = "#FFFFFF",
                    OutlineButton = "#990F02",
                    OutlineButtonText = "#000000",
                    ImageOverlay = "rgba(0, 0, 0, 0.1)"
                }
            }
        };

        private ProductCardsConfig GetDefaultProductCards() => new ProductCardsConfig
        {
            Image = new ProductImageConfig { DefaultRatio = "square-1-1-fill" },
            Visibility = new ProductVisibilityConfig 
            { 
                ShowVendor = false,
                ShowCurrencyCode = true,
                ShowColorCount = true,
                ColorizeCardBackground = true,
                DarkenImageBackground = true
            },
            Rating = new ProductRatingConfig { ProductRating = "average-and-stars" },
            Price = new ProductPriceConfig { LabelSize = "large" },
            Effects = new ProductEffectsConfig { HoverEffect = "none" },
            Swatches = new ProductSwatchesConfig 
            { 
                WhatToShow = "color-swatches",
                ShowOnDesktop = "on-hover",
                ShowOnMobile = "always",
                HideForSingleColor = true
            },
            Buttons = new ProductButtonsConfig 
            { 
                QuickBuy = false,
                ShowQuickView = false,
                ShowAddToCart = false,
                DesktopStyle = "labels",
                ShowOnHover = true
            }
        };

        private ProductBadgesConfig GetDefaultProductBadges() => new ProductBadgesConfig
        {
            Sale = new BadgeConfig 
            { 
                Enabled = true, 
                Label = "Oferta", 
                BackgroundColor = "#FF0000", 
                TextColor = "#FFFFFF",
                Position = "top-left",
                Shape = "rectangle"
            },
            SoldOut = new BadgeConfig 
            { 
                Enabled = true, 
                Label = "Agotado", 
                BackgroundColor = "#666666", 
                TextColor = "#FFFFFF",
                Position = "top-left",
                Shape = "rectangle"
            },
            NewProduct = new BadgeConfig 
            { 
                Enabled = true, 
                Label = "Nuevo", 
                BackgroundColor = "#00FF00", 
                TextColor = "#000000",
                Position = "top-right",
                Shape = "circle"
            },
            ComingSoon = new BadgeConfig { Enabled = false },
            LimitedEdition = new BadgeConfig { Enabled = false },
            Exclusive = new BadgeConfig { Enabled = false },
            Custom = new BadgeConfig { Enabled = false }
        };

        private CartConfig GetDefaultCart() => new CartConfig
        {
            DrawerType = "overlay",
            FreeShipping = new FreeShippingConfig
            {
                ShowProgress = true,
                Threshold = 50.00m,
                ProgressBarColor = "#28a745",
                SuccessMessage = "¡Envío gratis conseguido!",
                ProgressMessage = "Te faltan {amount} para envío gratis"
            }
        };

        private FaviconConfig GetDefaultFavicon() => new FaviconConfig
        {
            CustomFavicon = true,
            FaviconUrl = "/favicon-custom.ico"
        };

        private NavigationConfig GetDefaultNavigation() => new NavigationConfig
        {
            Search = new SearchConfig { ShowAs = "drawer-only" },
            BackToTop = new BackToTopConfig { ShowButton = true, Position = "bottom-center" }
        };

        private SocialMediaConfig GetDefaultSocialMedia() => new SocialMediaConfig
        {
            Facebook = "https://facebook.com/jacarandaplaza",
            Instagram = "https://instagram.com/jacarandaplaza"
        };

        private SwatchesConfig GetDefaultSwatches() => new SwatchesConfig
        {
            ColorSwatches = new SwatchDisplayConfig
            {
                Shape = "circle",
                Size = "medium",
                ShowBorder = true,
                BorderColor = "#E5E5E5",
                ShowTooltip = true,
                ShowCheckmark = true,
                MaxVisible = 5
            },
            SizeSwatches = new SwatchDisplayConfig
            {
                Shape = "square",
                Size = "medium",
                ShowBorder = true,
                BorderColor = "#E5E5E5",
                ShowTooltip = false,
                ShowCheckmark = false,
                MaxVisible = 8
            },
            MaterialSwatches = new SwatchDisplayConfig
            {
                Shape = "rounded",
                Size = "medium",
                ShowBorder = true,
                BorderColor = "#E5E5E5",
                ShowTooltip = true,
                ShowCheckmark = false,
                MaxVisible = 4
            },
            GroupByType = true,
            ShowUnavailable = true,
            NoSwatchesText = "No hay opciones disponibles"
        };

        #endregion

        #endregion
    }
}