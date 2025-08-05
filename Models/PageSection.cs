using System;

namespace WebsiteBuilderAPI.Models
{
    public class PageSection
    {
        public int Id { get; set; }
        public int PageId { get; set; }
        public string SectionType { get; set; } = string.Empty; // image_with_text, gallery, etc.
        public string Config { get; set; } = "{}"; // Configuración JSON de la sección
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        // Navegación
        public WebsitePage Page { get; set; } = null!;
    }
}