using System;

namespace WebsiteBuilderAPI.Models
{
    public class EditorHistory
    {
        public int Id { get; set; }
        public int PageId { get; set; }
        public int? UserId { get; set; }
        public string StateData { get; set; } = "{}"; // Estado completo de la página en JSON
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navegación
        public WebsitePage Page { get; set; } = null!;
    }
}