using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteBuilderAPI.Data;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SetupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SetupController> _logger;

        public SetupController(ApplicationDbContext context, ILogger<SetupController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Inicializa o actualiza los permisos del sistema
        /// </summary>
        [HttpPost("seed-permissions")]
        [AllowAnonymous] // Temporalmente permitir sin auth para configuración inicial
        public async Task<IActionResult> SeedPermissions()
        {
            try
            {
                _logger.LogInformation("Starting permissions seeding...");
                
                // Seed permissions
                await PermissionsSeeder.SeedPermissionsAsync(_context);
                _logger.LogInformation("Permissions seeded successfully");

                // Seed roles with permissions
                await PermissionsSeeder.SeedRolesAsync(_context);
                _logger.LogInformation("Roles seeded successfully");

                // Create default super admin user
                await PermissionsSeeder.SeedDefaultUserAsync(_context);
                _logger.LogInformation("Default user created successfully");

                return Ok(new 
                { 
                    message = "Permissions, roles and default user seeded successfully",
                    details = new
                    {
                        defaultUser = "admin@websitebuilder.com",
                        defaultPassword = "Admin@123",
                        note = "Please change the default password after first login"
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding permissions");
                return StatusCode(500, new { message = "Error seeding permissions", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene estadísticas del sistema de permisos
        /// </summary>
        [HttpGet("permissions-stats")]
        [Authorize]
        public async Task<IActionResult> GetPermissionsStats()
        {
            try
            {
                var permissionsCount = _context.Permissions.Count();
                var rolesCount = _context.Roles.Count();
                var usersCount = _context.Users.Count();
                var userRolesCount = _context.UserRoles.Count();

                var stats = new
                {
                    totalPermissions = permissionsCount,
                    totalRoles = rolesCount,
                    totalUsers = usersCount,
                    totalUserRoleAssignments = userRolesCount,
                    systemRoles = _context.Roles.Where(r => r.IsSystemRole).Select(r => r.Name).ToList(),
                    resources = _context.Permissions.Select(p => p.Resource).Distinct().OrderBy(r => r).ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permissions stats");
                return StatusCode(500, new { message = "Error getting stats", error = ex.Message });
            }
        }
    }
}