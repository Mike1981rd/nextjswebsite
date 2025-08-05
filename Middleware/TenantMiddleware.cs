using Microsoft.AspNetCore.Http;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Middleware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TenantMiddleware> _logger;

        public TenantMiddleware(RequestDelegate next, ILogger<TenantMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
        {
            var host = context.Request.Host.Value.ToLower();
            _logger.LogDebug($"Processing request for host: {host}");

            // Resolver el tenant basado en el dominio/subdominio
            var tenant = await tenantService.GetTenantAsync(host);
            
            if (tenant == null)
            {
                _logger.LogWarning($"Tenant not found for host: {host}");
                
                // Si no es una ruta de API pública, retornar 404
                if (!IsPublicRoute(context.Request.Path))
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("Hotel not found");
                    return;
                }
            }
            else
            {
                // Almacenar el tenant en el contexto HTTP
                context.Items["CurrentTenant"] = tenant;
                _logger.LogInformation($"Tenant resolved: {tenant.Name} (ID: {tenant.Id})");
            }

            await _next(context);
        }

        private bool IsPublicRoute(PathString path)
        {
            // Rutas que no requieren tenant (login, registro, etc.)
            var publicRoutes = new[]
            {
                "/api/auth/login",
                "/api/auth/register",
                "/health",
                "/swagger"
            };

            return publicRoutes.Any(route => path.StartsWithSegments(route, StringComparison.OrdinalIgnoreCase));
        }
    }

    // Extension method para registrar el middleware
    public static class TenantMiddlewareExtensions
    {
        public static IApplicationBuilder UseMultiTenant(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TenantMiddleware>();
        }
    }
}