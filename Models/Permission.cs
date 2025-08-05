using System.Collections.Generic;

namespace WebsiteBuilderAPI.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Module { get; set; } = string.Empty; // Dashboard, Productos, etc.
        public string Action { get; set; } = string.Empty; // View, Create, Edit, Delete
        public string Description { get; set; } = string.Empty;

        // Navegación
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

        // Módulos del sistema
        public const string ModuleDashboard = "Dashboard";
        public const string ModuleEmpresa = "Empresa";
        public const string ModuleUsers = "Users";
        public const string ModuleRooms = "Rooms";
        public const string ModuleProducts = "Products";
        public const string ModuleReservations = "Reservations";
        public const string ModuleWebsiteBuilder = "WebsiteBuilder";
        public const string ModuleDomains = "Domains";

        // Acciones permitidas
        public const string ActionView = "View";
        public const string ActionCreate = "Create";
        public const string ActionEdit = "Edit";
        public const string ActionDelete = "Delete";
        public const string ActionManage = "Manage"; // Para acciones especiales
    }
}