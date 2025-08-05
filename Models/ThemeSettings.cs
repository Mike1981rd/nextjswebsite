using System;

namespace WebsiteBuilderAPI.Models
{
    public class ThemeSettings
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string? ColorScheme { get; set; } // JSON con esquema de colores
        public string? Typography { get; set; }   // JSON con configuración tipográfica
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        // Navegación
        public Hotel Hotel { get; set; } = null!;
    }
}