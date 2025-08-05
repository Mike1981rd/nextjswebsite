using System;
using System.Collections.Generic;

namespace WebsiteBuilderAPI.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Domain { get; set; }
        public string? CustomDomain { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Relaciones
        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<WebsitePage> WebsitePages { get; set; } = new List<WebsitePage>();
        public ThemeSettings? ThemeSettings { get; set; }
        public ICollection<NavigationMenu> NavigationMenus { get; set; } = new List<NavigationMenu>();
    }
}