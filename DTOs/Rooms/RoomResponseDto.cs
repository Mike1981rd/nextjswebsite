using System;
using System.Collections.Generic;

namespace WebsiteBuilderAPI.DTOs.Rooms
{
    public class RoomResponseDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Precios
        public decimal BasePrice { get; set; }
        public decimal? ComparePrice { get; set; }

        // Información específica
        public int MaxOccupancy { get; set; }
        public string? RoomCode { get; set; }
        public string? RoomType { get; set; }
        public int? FloorNumber { get; set; }
        public string? ViewType { get; set; }
        public decimal? SquareMeters { get; set; }

        // Organización
        public List<string>? Tags { get; set; }
        public List<string>? Amenities { get; set; }

        // Multimedia
        public List<string>? Images { get; set; }

        // Control
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}