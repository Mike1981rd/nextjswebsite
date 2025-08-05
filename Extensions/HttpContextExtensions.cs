using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Extensions
{
    public static class HttpContextExtensions
    {
        private const string TENANT_KEY = "CurrentTenant";

        public static TenantInfo? GetTenant(this HttpContext httpContext)
        {
            if (httpContext?.Items.ContainsKey(TENANT_KEY) == true)
            {
                return httpContext.Items[TENANT_KEY] as TenantInfo;
            }
            return null;
        }

        public static int? GetTenantId(this HttpContext httpContext)
        {
            return httpContext.GetTenant()?.Id;
        }

        public static string? GetTenantName(this HttpContext httpContext)
        {
            return httpContext.GetTenant()?.Name;
        }

        public static bool HasTenant(this HttpContext httpContext)
        {
            return httpContext.GetTenant() != null;
        }

        public static void SetTenant(this HttpContext httpContext, TenantInfo tenant)
        {
            httpContext.Items[TENANT_KEY] = tenant;
        }
    }
}