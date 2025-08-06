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
        public DbSet<Company> Companies { get; set; }
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
        
        // Entidades de autenticación
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        
        // Entidades de empresa
        public DbSet<PaymentProvider> PaymentProviders { get; set; }
        public DbSet<CheckoutSettings> CheckoutSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Company
            modelBuilder.Entity<Company>(entity =>
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
                entity.HasOne(e => e.Company)
                    .WithMany(h => h.Rooms)
                    .HasForeignKey(e => e.CompanyId);
            });

            // Configuración de Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BasePrice).HasPrecision(10, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Company)
                    .WithMany(h => h.Products)
                    .HasForeignKey(e => e.CompanyId);
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
                entity.HasOne(e => e.Company)
                    .WithMany(h => h.WebsitePages)
                    .HasForeignKey(e => e.CompanyId);
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
                entity.HasOne(e => e.Company)
                    .WithOne(h => h.ThemeSettings)
                    .HasForeignKey<ThemeSettings>(e => e.CompanyId);
            });

            // Configuración de NavigationMenu
            modelBuilder.Entity<NavigationMenu>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MenuType).HasMaxLength(50);
                entity.Property(e => e.Items).HasColumnType("jsonb");
                entity.HasOne(e => e.Company)
                    .WithMany(h => h.NavigationMenus)
                    .HasForeignKey(e => e.CompanyId);
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
                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId);
            });

            // Configuración de ProductShoppingCart
            modelBuilder.Entity<ProductShoppingCart>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SessionId).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Items).HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId);
            });

            // Configuración de User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Company)
                    .WithMany()
                    .HasForeignKey(e => e.CompanyId)
                    .IsRequired(false);
            });

            // Configuración de Role
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Description).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configuración de UserRole (tabla de unión)
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });
                entity.Property(e => e.AssignedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(e => e.RoleId);
                entity.HasOne(e => e.AssignedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.AssignedByUserId)
                    .IsRequired(false);
            });

            // Configuración de Permission
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Resource).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => new { e.Resource, e.Action }).IsUnique();
            });

            // Configuración de RolePermission (tabla de unión)
            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.HasKey(e => new { e.RoleId, e.PermissionId });
                entity.Property(e => e.GrantedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Role)
                    .WithMany(r => r.RolePermissions)
                    .HasForeignKey(e => e.RoleId);
                entity.HasOne(e => e.Permission)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(e => e.PermissionId);
            });

            // Configuración de PaymentProvider
            modelBuilder.Entity<PaymentProvider>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Provider).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TransactionFee).HasPrecision(5, 4); // 99.9999%
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Company)
                    .WithMany(h => h.PaymentProviders)
                    .HasForeignKey(e => e.CompanyId);
                
                // Índices para optimización
                entity.HasIndex(e => new { e.CompanyId, e.Provider }).IsUnique();
                entity.HasIndex(e => e.IsActive);
            });

            // Configuración de CheckoutSettings
            modelBuilder.Entity<CheckoutSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ContactMethod).IsRequired().HasMaxLength(20);
                entity.Property(e => e.FullNameOption).IsRequired().HasMaxLength(20);
                entity.Property(e => e.CompanyNameField).IsRequired().HasMaxLength(20);
                entity.Property(e => e.AddressLine2Field).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PhoneNumberField).IsRequired().HasMaxLength(20);
                entity.Property(e => e.TermsAndConditionsUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasOne(e => e.Company)
                    .WithOne()
                    .HasForeignKey<CheckoutSettings>(e => e.CompanyId);
                
                // Índice único para asegurar una configuración por empresa
                entity.HasIndex(e => e.CompanyId).IsUnique();
            });
        }
    }
}