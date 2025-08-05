# Sistema de Roles y Permisos - Implementación

[← Back to Auth Index](./auth-00-index.md) | [← Back to Implementations Index](../00-implementations-index.md)

## Overview
- **Purpose**: Implementar un sistema RBAC (Role-Based Access Control) con permisos granulares de 5 niveles para controlar acceso a recursos y acciones en el sistema multi-tenant
- **Scope**: Backend completo con controllers, services, DTOs, atributos de autorización y seed data
- **Dependencies**: ASP.NET Core Identity (parcial), JWT Bearer, Entity Framework Core, BCrypt.Net
- **Date Implemented**: 2025-08-11
- **Time Invested**: ~3 horas
- **Team Members**: Equipo de desarrollo con asistencia de Claude Code

---

## Architecture Decisions

### Pattern Used
RBAC (Role-Based Access Control) con permisos granulares. Usuarios → Roles → Permisos → Acciones sobre recursos.

### Technology Choices
- **RBAC sobre ABAC** porque es más simple de implementar y administrar para un sistema de hotel
- **5 niveles de permisos** (view, read, create, update, delete) para máxima flexibilidad
- **Attribute-based authorization** para proteger endpoints de forma declarativa
- **JWT con claims de permisos** para validación stateless eficiente

### Security Considerations
- Authentication: JWT con roles y permisos incluidos
- Authorization: RequirePermission attribute valida permisos específicos
- Multi-tenancy: Usuarios solo acceden a datos de su hotel (excepto SuperAdmin)
- Data validation: DTOs con validaciones, roles de sistema protegidos

---

## Implementation Details

### Backend Implementation

#### Models Created/Modified
```csharp
// Permission.cs - Modificado de Module a Resource
public class Permission
{
    public int Id { get; set; }
    public string Resource { get; set; } = string.Empty; // dashboard, products, etc.
    public string Action { get; set; } = string.Empty; // view, read, create, update, delete
    public string Description { get; set; } = string.Empty;
    public ICollection<RolePermission> RolePermissions { get; set; }
}

// No se crearon modelos nuevos, se usaron los existentes:
// - User, Role, UserRole, RolePermission
```

#### Database Changes
- Migración: `RenameModuleToResource`
- Cambios:
  - Renombrar columna `Module` → `Resource` en tabla Permissions
  - Eliminar columna `Name` de Permissions
  - Actualizar índice único a (Resource, Action)

#### API Endpoints
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| **Roles** |
| GET    | /api/roles | Lista todos los roles | roles.read |
| GET    | /api/roles/{id} | Obtiene un rol | roles.read |
| POST   | /api/roles | Crea nuevo rol | roles.create |
| PUT    | /api/roles/{id} | Actualiza rol | roles.update |
| DELETE | /api/roles/{id} | Elimina rol | roles.delete |
| POST   | /api/roles/{id}/permissions | Asigna permisos | roles.update |
| **Users** |
| GET    | /api/users | Lista usuarios (multi-tenant) | users.read |
| GET    | /api/users/{id} | Obtiene usuario | users.read |
| POST   | /api/users | Crea usuario | users.create |
| PUT    | /api/users/{id} | Actualiza usuario | users.update |
| DELETE | /api/users/{id} | Desactiva usuario | users.delete |
| GET    | /api/users/{id}/permissions | Permisos efectivos | users.read |
| POST   | /api/users/change-password | Cambia contraseña | Authenticated |
| GET    | /api/users/me | Usuario actual | Authenticated |
| **Permissions** |
| GET    | /api/permissions | Lista permisos | roles.read |
| GET    | /api/permissions/grouped | Agrupados por recurso | roles.read |
| GET    | /api/permissions/by-resource/{resource} | Por recurso | roles.read |
| POST   | /api/permissions/seed | Inicializa permisos | SuperAdmin |

#### Services & Repositories
```csharp
// IRoleService & RoleService
public interface IRoleService
{
    Task<List<RoleDto>> GetAllAsync();
    Task<RoleDto?> GetByIdAsync(int id);
    Task<RoleDto> CreateAsync(CreateRoleDto dto);
    Task<RoleDto> UpdateAsync(int id, UpdateRoleDto dto);
    Task DeleteAsync(int id);
    Task AssignPermissionsAsync(int roleId, List<int> permissionIds);
}

// IUserService & UserService
public interface IUserService
{
    Task<List<UserDto>> GetAllAsync(int? hotelId = null);
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto> CreateAsync(CreateUserDto dto, int? hotelId = null);
    Task<UserDto> UpdateAsync(int id, UpdateUserDto dto);
    Task DeleteAsync(int id); // Soft delete
    Task<List<string>> GetEffectivePermissionsAsync(int userId);
    Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
}

// IPermissionService & PermissionService
public interface IPermissionService
{
    Task<List<PermissionDto>> GetAllAsync();
    Task<List<GroupedPermissionsDto>> GetGroupedAsync();
    Task SeedPermissionsAsync();
}
```

### Authorization Implementation

#### RequirePermission Attribute
```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequirePermissionAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    private readonly string _permission;

    public RequirePermissionAttribute(string permission)
    {
        _permission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // SuperAdmin bypasses all checks
        if (context.HttpContext.User.IsInRole("SuperAdmin"))
            return;

        // Check specific permission
        var permissions = context.HttpContext.User.FindAll("permissions");
        if (!permissions.Any(p => p.Value == _permission))
        {
            context.Result = new ForbidResult();
        }
    }
}
```

#### JWT Token Enhancement
```csharp
// AuthService.GenerateJwtToken actualizado
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Name, user.FullName),
    new Claim("hotelId", user.HotelId?.ToString() ?? "")
};

// Agregar roles
foreach (var role in roles)
{
    claims.Add(new Claim(ClaimTypes.Role, role));
}

// Agregar permisos
foreach (var permission in permissions)
{
    claims.Add(new Claim("permissions", permission));
}
```

---

## Configuration

### Environment Variables
No se requieren nuevas variables de entorno.

### Package Installations

#### Backend Packages
No se instalaron paquetes nuevos, se usaron los existentes:
- Microsoft.AspNetCore.Authentication.JwtBearer
- BCrypt.Net-Next

### Configuration Files Modified
- `Program.cs` - Agregado registro de servicios y configuración Swagger mejorada
- `ApplicationDbContext.cs` - Actualizada configuración de Permission

---

## Testing

### Manual Testing Checklist
- [x] Login como SuperAdmin funciona
- [x] JWT incluye roles y permisos
- [x] CRUD de roles funciona
- [x] CRUD de usuarios respeta multi-tenancy
- [x] Permisos se validan correctamente
- [x] No se pueden eliminar roles del sistema
- [x] No se puede auto-eliminar usuario
- [x] Soft delete de usuarios funciona

---

## Known Issues & Limitations

### Current Limitations
1. No hay refresh tokens implementados
2. No hay auditoría de cambios en roles/permisos
3. No se puede delegar permisos temporalmente
4. No hay permisos a nivel de registro individual

### Future Improvements
- [ ] Implementar refresh tokens
- [ ] Agregar audit trail para cambios de permisos
- [ ] Sistema de delegación temporal
- [ ] Permisos por registro (ej: solo editar MIS productos)
- [ ] Grupos de permisos para simplificar asignación
- [ ] Caché de permisos para mejor performance

### Performance Considerations
- Permisos se cargan en cada request (no hay caché)
- JWT puede crecer mucho con muchos permisos
- Considerar caché Redis para sistemas grandes

---

## Troubleshooting

### Common Problems
1. **Swagger schema conflict** → [auth-05-dto-naming-conflicts.md](../../troubleshooting/auth/auth-05-dto-naming-conflicts.md)
2. **Permission.Resource not found** → Ejecutar migración RenameModuleToResource
3. **403 Forbidden en endpoints** → Verificar permisos del rol en base de datos

### Debug Tips
- Decodificar JWT en jwt.io para ver claims
- Verificar permisos en tabla RolePermissions
- Logs muestran qué permiso falta
- SuperAdmin bypasea todos los checks

---

## Code Examples

### Basic Usage
```csharp
// Proteger endpoint con permiso
[HttpPost]
[RequirePermission("products.create")]
public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
{
    // Solo usuarios con products.create pueden acceder
}

// Obtener permisos del usuario actual
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var permissions = await _userService.GetEffectivePermissionsAsync(int.Parse(userId));
```

### Advanced Usage
```csharp
// Multi-tenant check en servicio
public async Task<List<UserDto>> GetAllAsync(int? hotelId = null)
{
    var query = _context.Users.AsQueryable();
    
    if (hotelId.HasValue)
    {
        query = query.Where(u => u.HotelId == hotelId.Value);
    }
    
    return await query.Select(u => MapToDto(u)).ToListAsync();
}

// Validar acción según rol
var isSuperAdmin = User.IsInRole("SuperAdmin");
if (!isSuperAdmin && existingUser.HotelId != currentHotelId)
{
    return Forbid("No tiene permisos para este hotel");
}
```

---

## References

### Related Documentation
- [rolesusuarios.md](../../../rolesusuarios.md) - Documentación técnica del sistema
- [PROJECT-PROGRESS.md](../../../PROJECT-PROGRESS.md) - Estado del proyecto
- [BLUEPRINT.md](../../../blueprint1.md) - Diseño original

### External Resources
- [ASP.NET Core Authorization](https://docs.microsoft.com/aspnet/core/security/authorization/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [RBAC vs ABAC](https://www.okta.com/identity-101/rbac-vs-abac/)

### Related Features
- Login System - Usa los roles y permisos
- Multi-tenant Middleware - Respeta permisos por hotel
- Todos los módulos futuros - Usarán RequirePermission

---

## Changelog

### 2025-08-11 - Initial Implementation
- Implementado sistema completo de roles y permisos
- 5 roles predefinidos con permisos específicos
- 67 permisos para 15 recursos del sistema
- Controllers, services y DTOs completos
- Attribute-based authorization
- Multi-tenant support
- Seed data con usuarios de prueba

---

**Last Updated**: 2025-08-11
**Primary Author**: Equipo de Desarrollo
**Reviewers**: Claude Code