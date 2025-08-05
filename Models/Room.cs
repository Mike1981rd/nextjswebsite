using System;
using System.Text.Json;

namespace WebsiteBuilderAPI.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }
        public string? Images { get; set; } // JSON almacenado como string
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        // Navegación
        public Company Company { get; set; } = null!;

        // Propiedad helper para trabajar con imágenes
        public List<string> GetImagesList()
        {
            if (string.IsNullOrEmpty(Images))
                return new List<string>();
            
            try
            {
                return JsonSerializer.Deserialize<List<string>>(Images) ?? new List<string>();
            }
            catch
            {
                return new List<string>();
            }
        }

        public void SetImagesList(List<string> images)
        {
            Images = JsonSerializer.Serialize(images);
        }
    }
}