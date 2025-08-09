using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebsiteBuilderAPI.DTOs.Rooms
{
    public class UpdateRoomDto
    {
        [StringLength(200, ErrorMessage = "El nombre no puede exceder 200 caracteres")]
        public string? Name { get; set; }

        [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
        public string? Description { get; set; }

        // Precios
        [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor o igual a 0")]
        public decimal? BasePrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El precio de comparación debe ser mayor o igual a 0")]
        public decimal? ComparePrice { get; set; }

        // Información específica
        [Range(1, 20, ErrorMessage = "La ocupación debe estar entre 1 y 20 personas")]
        public int? MaxOccupancy { get; set; }

        [StringLength(50, ErrorMessage = "El código no puede exceder 50 caracteres")]
        public string? RoomCode { get; set; }

        [StringLength(100, ErrorMessage = "El tipo no puede exceder 100 caracteres")]
        public string? RoomType { get; set; }

        [Range(0, 200, ErrorMessage = "El piso debe estar entre 0 y 200")]
        public int? FloorNumber { get; set; }

        [StringLength(100, ErrorMessage = "El tipo de vista no puede exceder 100 caracteres")]
        public string? ViewType { get; set; }

        [Range(0, 10000, ErrorMessage = "Los metros cuadrados deben estar entre 0 y 10000")]
        public decimal? SquareMeters { get; set; }

        // Organización
        public List<string>? Tags { get; set; }
        public List<string>? Amenities { get; set; }

        // Multimedia
        public List<string>? Images { get; set; }

        // Control
        public bool? IsActive { get; set; }
    }
}