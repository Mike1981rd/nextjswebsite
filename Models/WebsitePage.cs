using System;
using System.Collections.Generic;
using WebsiteBuilderAPI.Data.Filters;

namespace WebsiteBuilderAPI.Models
{
    public class WebsitePage : ITenantEntity
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string PageType { get; set; } = string.Empty; // home, product, cart, checkout, custom
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navegación
        public Hotel Hotel { get; set; } = null!;
        public ICollection<PageSection> Sections { get; set; } = new List<PageSection>();
        public ICollection<EditorHistory> EditorHistories { get; set; } = new List<EditorHistory>();
    }
}