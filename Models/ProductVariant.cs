using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebsiteBuilderAPI.Models
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Attributes { get; set; } // JSON almacenado como string
        public bool IsActive { get; set; } = true;

        // Navegación
        [JsonIgnore]
        public Product Product { get; set; } = null!;

        // Helper para trabajar con atributos
        public Dictionary<string, string> GetAttributes()
        {
            if (string.IsNullOrEmpty(Attributes))
                return new Dictionary<string, string>();
            
            try
            {
                return JsonSerializer.Deserialize<Dictionary<string, string>>(Attributes) 
                    ?? new Dictionary<string, string>();
            }
            catch
            {
                return new Dictionary<string, string>();
            }
        }

        public void SetAttributes(Dictionary<string, string> attributes)
        {
            Attributes = JsonSerializer.Serialize(attributes);
        }
    }
}