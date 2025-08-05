using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data.Filters;
using WebsiteBuilderAPI.Models;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Data
{
    public class TenantAwareDbContext : ApplicationDbContext
    {
        private readonly ITenantService _tenantService;

        public TenantAwareDbContext(
            DbContextOptions<ApplicationDbContext> options,
            ITenantService tenantService)
            : base(options)
        {
            _tenantService = tenantService;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aplicar filtros globales de tenant solo si hay un tenant activo
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (currentTenantId.HasValue)
            {
                // Aplicar filtro a Room
                modelBuilder.Entity<Room>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a Product
                modelBuilder.Entity<Product>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a WebsitePage
                modelBuilder.Entity<WebsitePage>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a ThemeSettings
                modelBuilder.Entity<ThemeSettings>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a NavigationMenu
                modelBuilder.Entity<NavigationMenu>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a RoomReservationCart
                modelBuilder.Entity<RoomReservationCart>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a ProductShoppingCart
                modelBuilder.Entity<ProductShoppingCart>()
                    .HasQueryFilter(e => e.HotelId == currentTenantId.Value);

                // Aplicar filtro a User (usuarios pertenecen a un hotel)
                modelBuilder.Entity<User>()
                    .HasQueryFilter(e => e.HotelId == null || e.HotelId == currentTenantId.Value);
            }
        }

        // Método para ignorar filtros de tenant cuando sea necesario
        public IQueryable<T> GetUnfilteredQueryable<T>() where T : class
        {
            return Set<T>().IgnoreQueryFilters();
        }
    }
}