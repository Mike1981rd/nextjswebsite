using WebsiteBuilderAPI.DTOs.Company;

namespace WebsiteBuilderAPI.Services
{
    public interface ICompanyService
    {
        Task<CompanyResponseDto?> GetCurrentCompanyAsync();
        Task<CompanyResponseDto?> UpdateCurrentCompanyAsync(UpdateCompanyRequestDto request);
        Task<string> UploadLogoAsync(IFormFile file);
        Task<CompanyConfigDto?> GetCompanyConfigAsync();
    }
}