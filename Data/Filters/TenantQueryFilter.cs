using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WebsiteBuilderAPI.Models;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Data.Filters
{
    public interface ITenantEntity
    {
        int HotelId { get; set; }
    }

    public static class TenantQueryExtensions
    {
        public static void AddTenantQueryFilter<T>(this ModelBuilder modelBuilder, ITenantService tenantService) where T : class, ITenantEntity
        {
            modelBuilder.Entity<T>().HasQueryFilter(entity => entity.HotelId == tenantService.GetCurrentTenantId());
        }

        public static IQueryable<T> ApplyTenantFilter<T>(this IQueryable<T> query, int? tenantId) where T : class, ITenantEntity
        {
            if (tenantId.HasValue)
            {
                return query.Where(e => e.HotelId == tenantId.Value);
            }
            return query;
        }
    }
}