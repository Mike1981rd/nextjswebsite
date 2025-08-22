using WebsiteBuilderAPI.DTOs.Company;
using WebsiteBuilderAPI.DTOs.CheckoutSettings;

namespace WebsiteBuilderAPI.Services
{
    public interface ICompanyService
    {
        Task<CompanyResponseDto?> GetCurrentCompanyAsync();
        Task<CompanyResponseDto?> GetCompanyByIdAsync(int companyId);
        Task<CompanyResponseDto?> UpdateCurrentCompanyAsync(UpdateCompanyRequestDto request);
        Task<string> UploadLogoAsync(IFormFile file);
        Task UpdateLogoSizeAsync(int size);
        Task<CompanyConfigDto?> GetCompanyConfigAsync();
        Task UpdateLogoAsync(string logoUrl);
        
        // Checkout Settings methods
        Task<CheckoutSettingsDto?> GetCheckoutSettingsAsync();
        Task<CheckoutSettingsDto> CreateDefaultCheckoutSettingsAsync();
        Task<CheckoutSettingsDto> UpdateCheckoutSettingsAsync(UpdateCheckoutSettingsDto request);
        Task<CheckoutSettingsDto> ResetCheckoutSettingsAsync();
    }
}