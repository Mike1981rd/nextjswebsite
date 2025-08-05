namespace WebsiteBuilderAPI.Models
{
    public class NavigationMenu
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string? MenuType { get; set; } // header, footer
        public string? Items { get; set; }   // JSON array de elementos del menú
        public bool IsActive { get; set; } = true;

        // Navegación
        public Hotel Hotel { get; set; } = null!;
    }
}