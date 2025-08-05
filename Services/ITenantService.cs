using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Services
{
    public interface ITenantService
    {
        Task<TenantInfo?> GetTenantAsync(string host);
        Task<Hotel?> GetCurrentTenantAsync();
        int? GetCurrentTenantId();
        bool HasTenant();
    }

    public class TenantInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string? Subdomain { get; set; }
        public bool IsActive { get; set; }
        public string? Logo { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
    }
}