using Microsoft.AspNetCore.Mvc;
using WebsiteBuilderAPI.Extensions;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected ITenantService TenantService => HttpContext.RequestServices.GetRequiredService<ITenantService>();

        protected int? CurrentTenantId => HttpContext.GetTenantId();
        
        protected string? CurrentTenantName => HttpContext.GetTenantName();

        protected bool HasTenant => HttpContext.HasTenant();

        protected TenantInfo? CurrentTenant => HttpContext.GetTenant();

        // Método helper para verificar que hay un tenant activo
        protected ActionResult EnsureTenant()
        {
            if (!HasTenant)
            {
                return NotFound(new { message = "Tenant not found" });
            }
            return new EmptyResult();
        }

        // Método para verificar que un recurso pertenece al tenant actual
        protected bool BelongsToCurrentTenant(int resourceTenantId)
        {
            return CurrentTenantId.HasValue && resourceTenantId == CurrentTenantId.Value;
        }
    }
}