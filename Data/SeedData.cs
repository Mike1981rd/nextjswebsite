using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Models;
using BCrypt.Net;

namespace WebsiteBuilderAPI.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Verificar si ya hay datos
            if (await context.Roles.AnyAsync())
            {
                return; // La BD ya tiene datos
            }

            // Crear roles del sistema
            var roles = new List<Role>
            {
                new Role
                {
                    Name = Role.SuperAdmin,
                    Description = "Administrador del sistema con acceso total",
                    IsSystemRole = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Name = Role.CompanyAdmin,
                    Description = "Administrador de company con acceso completo a su company",
                    IsSystemRole = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Name = "Editor",
                    Description = "Editor de contenido web",
                    IsSystemRole = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Name = "Receptionist",
                    Description = "Recepcionista del company",
                    IsSystemRole = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Name = "Viewer",
                    Description = "Solo lectura",
                    IsSystemRole = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();

            // Crear todos los permisos del sistema
            var permissions = new List<Permission>
            {
                // Dashboard
                new Permission { Resource = "dashboard", Action = "view", Description = "Ver dashboard en el menú" },
                new Permission { Resource = "dashboard", Action = "read", Description = "Acceder al dashboard" },

                // Users
                new Permission { Resource = "users", Action = "view", Description = "Ver usuarios en el menú" },
                new Permission { Resource = "users", Action = "read", Description = "Listar usuarios" },
                new Permission { Resource = "users", Action = "create", Description = "Crear nuevos usuarios" },
                new Permission { Resource = "users", Action = "update", Description = "Editar usuarios" },
                new Permission { Resource = "users", Action = "delete", Description = "Eliminar usuarios" },

                // Roles
                new Permission { Resource = "roles", Action = "view", Description = "Ver roles en el menú" },
                new Permission { Resource = "roles", Action = "read", Description = "Listar roles" },
                new Permission { Resource = "roles", Action = "create", Description = "Crear nuevos roles" },
                new Permission { Resource = "roles", Action = "update", Description = "Editar roles" },
                new Permission { Resource = "roles", Action = "delete", Description = "Eliminar roles" },

                // Products
                new Permission { Resource = "products", Action = "view", Description = "Ver productos en el menú" },
                new Permission { Resource = "products", Action = "read", Description = "Listar productos" },
                new Permission { Resource = "products", Action = "create", Description = "Crear nuevos productos" },
                new Permission { Resource = "products", Action = "update", Description = "Editar productos" },
                new Permission { Resource = "products", Action = "delete", Description = "Eliminar productos" },

                // Rooms
                new Permission { Resource = "rooms", Action = "view", Description = "Ver habitaciones en el menú" },
                new Permission { Resource = "rooms", Action = "read", Description = "Listar habitaciones" },
                new Permission { Resource = "rooms", Action = "create", Description = "Crear nuevas habitaciones" },
                new Permission { Resource = "rooms", Action = "update", Description = "Editar habitaciones" },
                new Permission { Resource = "rooms", Action = "delete", Description = "Eliminar habitaciones" },

                // Reservations
                new Permission { Resource = "reservations", Action = "view", Description = "Ver reservaciones en el menú" },
                new Permission { Resource = "reservations", Action = "read", Description = "Listar reservaciones" },
                new Permission { Resource = "reservations", Action = "create", Description = "Crear nuevas reservaciones" },
                new Permission { Resource = "reservations", Action = "update", Description = "Editar reservaciones" },
                new Permission { Resource = "reservations", Action = "delete", Description = "Cancelar reservaciones" },

                // Website
                new Permission { Resource = "website", Action = "view", Description = "Ver website builder en el menú" },
                new Permission { Resource = "website", Action = "read", Description = "Acceder al website builder" },
                new Permission { Resource = "website", Action = "update", Description = "Editar contenido del sitio web" },

                // Reports
                new Permission { Resource = "reports", Action = "view", Description = "Ver reportes en el menú" },
                new Permission { Resource = "reports", Action = "read", Description = "Acceder a reportes" },

                // Settings
                new Permission { Resource = "settings", Action = "view", Description = "Ver configuración en el menú" },
                new Permission { Resource = "settings", Action = "read", Description = "Ver configuración" },
                new Permission { Resource = "settings", Action = "update", Description = "Modificar configuración" },

                // Collections
                new Permission { Resource = "collections", Action = "view", Description = "Ver colecciones en el menú" },
                new Permission { Resource = "collections", Action = "read", Description = "Listar colecciones" },
                new Permission { Resource = "collections", Action = "create", Description = "Crear nuevas colecciones" },
                new Permission { Resource = "collections", Action = "update", Description = "Editar colecciones" },
                new Permission { Resource = "collections", Action = "delete", Description = "Eliminar colecciones" },

                // Payment Methods
                new Permission { Resource = "payment_methods", Action = "view", Description = "Ver métodos de pago en el menú" },
                new Permission { Resource = "payment_methods", Action = "read", Description = "Listar métodos de pago" },
                new Permission { Resource = "payment_methods", Action = "create", Description = "Crear nuevos métodos de pago" },
                new Permission { Resource = "payment_methods", Action = "update", Description = "Editar métodos de pago" },
                new Permission { Resource = "payment_methods", Action = "delete", Description = "Eliminar métodos de pago" },

                // Customers
                new Permission { Resource = "customers", Action = "view", Description = "Ver clientes en el menú" },
                new Permission { Resource = "customers", Action = "read", Description = "Listar clientes" },
                new Permission { Resource = "customers", Action = "create", Description = "Crear nuevos clientes" },
                new Permission { Resource = "customers", Action = "update", Description = "Editar clientes" },
                new Permission { Resource = "customers", Action = "delete", Description = "Eliminar clientes" },

                // Company/Company
                new Permission { Resource = "company", Action = "view", Description = "Ver empresa en el menú" },
                new Permission { Resource = "company", Action = "read", Description = "Ver información de la empresa" },
                new Permission { Resource = "company", Action = "update", Description = "Editar información de la empresa" },

                // Domains
                new Permission { Resource = "domains", Action = "view", Description = "Ver dominios en el menú" },
                new Permission { Resource = "domains", Action = "read", Description = "Listar dominios" },
                new Permission { Resource = "domains", Action = "create", Description = "Crear nuevos dominios" },
                new Permission { Resource = "domains", Action = "update", Description = "Editar dominios" },
                new Permission { Resource = "domains", Action = "delete", Description = "Eliminar dominios" },

                // Policies
                new Permission { Resource = "policies", Action = "view", Description = "Ver políticas en el menú" },
                new Permission { Resource = "policies", Action = "read", Description = "Listar políticas" },
                new Permission { Resource = "policies", Action = "create", Description = "Crear nuevas políticas" },
                new Permission { Resource = "policies", Action = "update", Description = "Editar políticas" },
                new Permission { Resource = "policies", Action = "delete", Description = "Eliminar políticas" }
            };

            await context.Permissions.AddRangeAsync(permissions);
            await context.SaveChangesAsync();

            // Obtener todos los roles para asignar permisos
            var superAdminRole = await context.Roles.FirstAsync(r => r.Name == Role.SuperAdmin);
            var companyAdminRole = await context.Roles.FirstAsync(r => r.Name == Role.CompanyAdmin);
            var editorRole = await context.Roles.FirstAsync(r => r.Name == "Editor");
            var receptionistRole = await context.Roles.FirstAsync(r => r.Name == "Receptionist");
            var viewerRole = await context.Roles.FirstAsync(r => r.Name == "Viewer");
            
            // SuperAdmin - Todos los permisos
            var allPermissions = await context.Permissions.ToListAsync();
            foreach (var permission in allPermissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = superAdminRole.Id,
                    PermissionId = permission.Id,
                    GrantedAt = DateTime.UtcNow
                });
            }

            // CompanyAdmin - Todo excepto gestión de usuarios y roles del sistema
            var companyAdminPermissions = allPermissions.Where(p => 
                !(p.Resource == "users" && (p.Action == "create" || p.Action == "delete")) &&
                !(p.Resource == "roles")).ToList();
            
            foreach (var permission in companyAdminPermissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = companyAdminRole.Id,
                    PermissionId = permission.Id,
                    GrantedAt = DateTime.UtcNow
                });
            }

            // Editor - Website, productos, colecciones
            var editorPermissions = allPermissions.Where(p => 
                p.Resource == "website" || 
                p.Resource == "products" || 
                p.Resource == "collections" ||
                p.Resource == "policies" ||
                (p.Resource == "dashboard" && (p.Action == "view" || p.Action == "read"))).ToList();
            
            foreach (var permission in editorPermissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = editorRole.Id,
                    PermissionId = permission.Id,
                    GrantedAt = DateTime.UtcNow
                });
            }

            // Receptionist - Habitaciones, reservaciones, clientes
            var receptionistPermissions = allPermissions.Where(p => 
                p.Resource == "rooms" || 
                p.Resource == "reservations" || 
                p.Resource == "customers" ||
                (p.Resource == "dashboard" && (p.Action == "view" || p.Action == "read"))).ToList();
            
            foreach (var permission in receptionistPermissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = receptionistRole.Id,
                    PermissionId = permission.Id,
                    GrantedAt = DateTime.UtcNow
                });
            }

            // Viewer - Solo lectura
            var viewerPermissions = allPermissions.Where(p => 
                p.Action == "view" || p.Action == "read").ToList();
            
            foreach (var permission in viewerPermissions)
            {
                context.RolePermissions.Add(new RolePermission
                {
                    RoleId = viewerRole.Id,
                    PermissionId = permission.Id,
                    GrantedAt = DateTime.UtcNow
                });
            }

            await context.SaveChangesAsync();

            // Crear company de prueba
            var defaultCompany = new Company
            {
                Name = "Company Demo",
                Domain = "demo",
                Subdomain = "demo",
                Logo = "/images/logo-demo.png",
                PrimaryColor = "#22c55e",
                SecondaryColor = "#64748b",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Companies.AddAsync(defaultCompany);
            await context.SaveChangesAsync();

            // Crear usuario admin
            var adminUser = new User
            {
                Email = "admin@admin.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                FirstName = "Super",
                LastName = "Admin",
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = null // SuperAdmin no pertenece a ningún company específico
            };

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();

            // Asignar rol SuperAdmin al usuario
            context.UserRoles.Add(new UserRole
            {
                UserId = adminUser.Id,
                RoleId = superAdminRole.Id,
                AssignedAt = DateTime.UtcNow
            });

            // Crear usuario admin del company
            var companyAdmin = new User
            {
                Email = "admin@company.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                FirstName = "Admin",
                LastName = "Company",
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = defaultCompany.Id
            };

            await context.Users.AddAsync(companyAdmin);
            await context.SaveChangesAsync();

            // Asignar rol CompanyAdmin
            context.UserRoles.Add(new UserRole
            {
                UserId = companyAdmin.Id,
                RoleId = companyAdminRole.Id,
                AssignedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
        }
    }
}