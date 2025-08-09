using System;
using System.Collections.Generic;
using System.Text.Json;

namespace WebsiteBuilderAPI.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        // Precios
        public decimal BasePrice { get; set; }
        public decimal? ComparePrice { get; set; } // Precio anterior (para tachar)
        
        // Información específica de habitación
        public int MaxOccupancy { get; set; }
        public string? RoomCode { get; set; } // Código único de habitación (ej: "SUITE-101")
        public string? RoomType { get; set; } // Tipo: Estándar, Suite, Deluxe, etc.
        public int? FloorNumber { get; set; } // Número de piso
        public string? ViewType { get; set; } // Vista: Mar, Ciudad, Jardín, etc.
        public decimal? SquareMeters { get; set; } // Tamaño en metros cuadrados
        
        // Organización y búsqueda
        public List<string>? Tags { get; set; } // JSONB para búsquedas
        public List<string>? Amenities { get; set; } // JSONB ["WiFi", "Minibar", "Jacuzzi", etc.]
        
        // Multimedia
        public List<string>? Images { get; set; } // URLs de imágenes (JSONB)
        
        // Control
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navegación
        public Company Company { get; set; } = null!;
    }
}