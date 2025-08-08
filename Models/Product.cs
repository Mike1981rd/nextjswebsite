using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebsiteBuilderAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public int Stock { get; set; } = 0;
        public bool HasVariants { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        // Navegación
        [JsonIgnore]
        public Company Company { get; set; } = null!;
        [JsonIgnore]
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
}