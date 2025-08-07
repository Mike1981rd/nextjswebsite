using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.DTOs.Permissions;
using WebsiteBuilderAPI.DTOs.Roles;
using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Services
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationDbContext _context;

        public RoleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RoleDto>> GetAllAsync()
        {
            var roles = await _context.Roles
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                .Include(r => r.UserRoles)
                    .ThenInclude(ur => ur.User)
                .OrderBy(r => r.Name)
                .ToListAsync();

            return roles.Select(r => MapToDto(r)).ToList();
        }

        public async Task<RoleDto?> GetByIdAsync(int id)
        {
            var role = await _context.Roles
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                .Include(r => r.UserRoles)
                    .ThenInclude(ur => ur.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            return role != null ? MapToDto(role) : null;
        }

        public async Task<RoleDto> CreateAsync(CreateRoleDto dto)
        {
            // Verificar si el rol ya existe
            if (await RoleExistsAsync(dto.Name))
            {
                throw new InvalidOperationException($"A role with name '{dto.Name}' already exists.");
            }

            var role = new Role
            {
                Name = dto.Name,
                Description = dto.Description,
                IsSystemRole = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            // Asignar permisos
            if (dto.PermissionIds.Any())
            {
                await AssignPermissionsAsync(role.Id, dto.PermissionIds);
            }

            return await GetByIdAsync(role.Id) ?? throw new InvalidOperationException("Failed to create role");
        }

        public async Task<RoleDto> UpdateAsync(int id, UpdateRoleDto dto)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with id {id} not found.");
            }

            if (role.IsSystemRole)
            {
                throw new InvalidOperationException("System roles cannot be modified.");
            }

            // Verificar nombre único
            if (await RoleExistsAsync(dto.Name, id))
            {
                throw new InvalidOperationException($"Another role with name '{dto.Name}' already exists.");
            }

            role.Name = dto.Name;
            role.Description = dto.Description;

            await _context.SaveChangesAsync();

            // Actualizar permisos
            await AssignPermissionsAsync(id, dto.PermissionIds);

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Failed to update role");
        }

        public async Task DeleteAsync(int id)
        {
            var role = await _context.Roles
                .Include(r => r.UserRoles)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null)
            {
                throw new KeyNotFoundException($"Role with id {id} not found.");
            }

            if (role.IsSystemRole)
            {
                throw new InvalidOperationException("System roles cannot be deleted.");
            }

            if (role.UserRoles.Any())
            {
                throw new InvalidOperationException("Cannot delete role that is assigned to users.");
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
        }

        public async Task AssignPermissionsAsync(int roleId, List<int> permissionIds)
        {
            var role = await _context.Roles
                .Include(r => r.RolePermissions)
                .FirstOrDefaultAsync(r => r.Id == roleId);

            if (role == null)
            {
                throw new KeyNotFoundException($"Role with id {roleId} not found.");
            }

            // Eliminar permisos existentes
            _context.RolePermissions.RemoveRange(role.RolePermissions);

            // Agregar nuevos permisos
            foreach (var permissionId in permissionIds.Distinct())
            {
                var permission = await _context.Permissions.FindAsync(permissionId);
                if (permission != null)
                {
                    role.RolePermissions.Add(new RolePermission
                    {
                        RoleId = roleId,
                        PermissionId = permissionId,
                        GrantedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> RoleExistsAsync(string name, int? excludeId = null)
        {
            var query = _context.Roles.Where(r => r.Name.ToLower() == name.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        private RoleDto MapToDto(Role role)
        {
            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                IsSystemRole = role.IsSystemRole,
                UserCount = role.UserRoles.Count,
                Avatars = role.UserRoles
                    .Where(ur => ur.User != null && !string.IsNullOrEmpty(ur.User.AvatarUrl))
                    .Take(4) // Solo tomar los primeros 4 avatares
                    .Select(ur => ur.User.AvatarUrl)
                    .ToList(),
                CreatedAt = role.CreatedAt,
                Permissions = role.RolePermissions.Select(rp => new PermissionDto
                {
                    Id = rp.Permission.Id,
                    Resource = rp.Permission.Resource,
                    Action = rp.Permission.Action,
                    Description = rp.Permission.Description
                }).ToList()
            };
        }
    }
}