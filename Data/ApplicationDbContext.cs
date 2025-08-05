using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets para todas las entidades
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<WebsitePage> WebsitePages { get; set; }
        public DbSet<PageSection> PageSections { get; set; }
        public DbSet<ThemeSettings> ThemeSettings { get; set; }
        public DbSet<NavigationMenu> NavigationMenus { get; set; }
        public DbSet<EditorHistory> EditorHistories { get; set; }
        public DbSet<RoomReservationCart> RoomReservationCarts { get; set; }
        public DbSet<ProductShoppingCart> ProductShoppingCarts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Hotel
            modelBuilder.Entity<Hotel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Domain).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configuración de Room
            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BasePrice).HasPrecision(10, 2);
                entity.Property(e => e.Images).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithMany(h => h.Rooms)
                    .HasForeignKey(e => e.HotelId);
            });

            // Configuración de Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BasePrice).HasPrecision(10, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithMany(h => h.Products)
                    .HasForeignKey(e => e.HotelId);
            });

            // Configuración de ProductVariant
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Price).HasPrecision(10, 2);
                entity.Property(e => e.Attributes).HasColumnType("jsonb");
                entity.HasOne(e => e.Product)
                    .WithMany(p => p.Variants)
                    .HasForeignKey(e => e.ProductId);
            });

            // Configuración de WebsitePage
            modelBuilder.Entity<WebsitePage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PageType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithMany(h => h.WebsitePages)
                    .HasForeignKey(e => e.HotelId);
            });

            // Configuración de PageSection
            modelBuilder.Entity<PageSection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SectionType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Config).HasColumnType("jsonb").IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Page)
                    .WithMany(p => p.Sections)
                    .HasForeignKey(e => e.PageId);
            });

            // Configuración de ThemeSettings
            modelBuilder.Entity<ThemeSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ColorScheme).HasColumnType("jsonb");
                entity.Property(e => e.Typography).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithOne(h => h.ThemeSettings)
                    .HasForeignKey<ThemeSettings>(e => e.HotelId);
            });

            // Configuración de NavigationMenu
            modelBuilder.Entity<NavigationMenu>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MenuType).HasMaxLength(50);
                entity.Property(e => e.Items).HasColumnType("jsonb");
                entity.HasOne(e => e.Hotel)
                    .WithMany(h => h.NavigationMenus)
                    .HasForeignKey(e => e.HotelId);
            });

            // Configuración de EditorHistory
            modelBuilder.Entity<EditorHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.StateData).HasColumnType("jsonb").IsRequired();
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Page)
                    .WithMany(p => p.EditorHistories)
                    .HasForeignKey(e => e.PageId);
            });

            // Configuración de RoomReservationCart
            modelBuilder.Entity<RoomReservationCart>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SessionId).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Items).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithMany()
                    .HasForeignKey(e => e.HotelId);
            });

            // Configuración de ProductShoppingCart
            modelBuilder.Entity<ProductShoppingCart>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SessionId).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Items).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Hotel)
                    .WithMany()
                    .HasForeignKey(e => e.HotelId);
            });
        }
    }
}