using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Services
{
    public class TenantService : ITenantService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly ILogger<TenantService> _logger;
        private const string TENANT_CACHE_KEY = "tenant_";
        private const int CACHE_DURATION_MINUTES = 30;

        public TenantService(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            IMemoryCache cache,
            ILogger<TenantService> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _logger = logger;
        }

        public async Task<TenantInfo?> GetTenantAsync(string host)
        {
            if (string.IsNullOrEmpty(host))
                return null;

            // Intentar obtener del cache
            var cacheKey = $"{TENANT_CACHE_KEY}{host}";
            if (_cache.TryGetValue<TenantInfo>(cacheKey, out var cachedTenant))
            {
                _logger.LogDebug($"Tenant retrieved from cache for host: {host}");
                return cachedTenant;
            }

            // Buscar en la base de datos
            Hotel? hotel = null;

            // Primero buscar por dominio completo
            hotel = await _context.Hotels
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Domain == host && h.IsActive);

            // Si no se encuentra, buscar por subdominio
            if (hotel == null)
            {
                var subdomain = ExtractSubdomain(host);
                if (!string.IsNullOrEmpty(subdomain))
                {
                    hotel = await _context.Hotels
                        .AsNoTracking()
                        .FirstOrDefaultAsync(h => h.Subdomain == subdomain && h.IsActive);
                }
            }

            if (hotel == null)
            {
                _logger.LogWarning($"No active hotel found for host: {host}");
                return null;
            }

            // Crear TenantInfo
            var tenantInfo = new TenantInfo
            {
                Id = hotel.Id,
                Name = hotel.Name,
                Domain = hotel.Domain ?? string.Empty,
                Subdomain = hotel.Subdomain,
                IsActive = hotel.IsActive,
                Logo = hotel.Logo,
                PrimaryColor = hotel.PrimaryColor,
                SecondaryColor = hotel.SecondaryColor
            };

            // Guardar en cache
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(CACHE_DURATION_MINUTES));
            _cache.Set(cacheKey, tenantInfo, cacheOptions);

            _logger.LogInformation($"Tenant resolved and cached: {tenantInfo.Name} for host: {host}");
            return tenantInfo;
        }

        public async Task<Hotel?> GetCurrentTenantAsync()
        {
            var tenantId = GetCurrentTenantId();
            if (!tenantId.HasValue)
                return null;

            return await _context.Hotels
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Id == tenantId.Value);
        }

        public int? GetCurrentTenantId()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.Items["CurrentTenant"] is TenantInfo tenant)
            {
                return tenant.Id;
            }
            return null;
        }

        public bool HasTenant()
        {
            return GetCurrentTenantId().HasValue;
        }

        private string? ExtractSubdomain(string host)
        {
            // Eliminar puerto si existe
            var hostWithoutPort = host.Split(':')[0];
            
            // Dividir por puntos
            var parts = hostWithoutPort.Split('.');
            
            // Si tiene 3 o más partes y no es www, el primero es el subdominio
            if (parts.Length >= 3 && parts[0] != "www")
            {
                return parts[0];
            }

            return null;
        }
    }
}