using System;
using System.Collections.Generic;

namespace WebsiteBuilderAPI.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Domain { get; set; }
        public string? CustomDomain { get; set; }
        public string? Subdomain { get; set; }
        public string? Logo { get; set; }
        public int LogoSize { get; set; } = 120; // Tamaño del logo en píxeles (default 120px)
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Profile Section
        public string? PhoneNumber { get; set; }
        public string? ContactEmail { get; set; }
        public string? SenderEmail { get; set; }

        // Billing Information
        public string? LegalBusinessName { get; set; }
        public string? Country { get; set; }
        public string? Region { get; set; }
        public string? Address { get; set; }
        public string? Apartment { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }

        // Time Zone & Units
        public string? TimeZone { get; set; }
        public string? MetricSystem { get; set; }
        public string? WeightUnit { get; set; }

        // Store Currency
        public string? Currency { get; set; }

        // Order ID Format
        public string? OrderIdPrefix { get; set; }
        public string? OrderIdSuffix { get; set; }

        // Relaciones
        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<WebsitePage> WebsitePages { get; set; } = new List<WebsitePage>();
        public ThemeSettings? ThemeSettings { get; set; }
        public ICollection<NavigationMenu> NavigationMenus { get; set; } = new List<NavigationMenu>();
        public ICollection<PaymentProvider> PaymentProviders { get; set; } = new List<PaymentProvider>();
    }
}