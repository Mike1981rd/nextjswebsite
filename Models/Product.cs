using System;
using System.Collections.Generic;
using WebsiteBuilderAPI.Data.Filters;

namespace WebsiteBuilderAPI.Models
{
    public class Product : ITenantEntity
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public bool HasVariants { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        // Navegación
        public Hotel Hotel { get; set; } = null!;
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
}