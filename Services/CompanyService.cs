using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.DTOs.Company;
using WebsiteBuilderAPI.DTOs.CheckoutSettings;
using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CompanyService> _logger;
        private readonly IWebHostEnvironment _environment;

        public CompanyService(
            ApplicationDbContext context,
            ILogger<CompanyService> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        public async Task<CompanyResponseDto?> GetCurrentCompanyAsync()
        {
            // Obtener la única empresa del sistema
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                // Si no existe, crear una por defecto
                currentCompany = new Company
                {
                    Name = "Mi Empresa",
                    IsActive = true,
                    PrimaryColor = "#22c55e",
                    SecondaryColor = "#64748b",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Companies.Add(currentCompany);
                await _context.SaveChangesAsync();
            }

            return MapToResponseDto(currentCompany);
        }

        public async Task<CompanyResponseDto?> GetCompanyByIdAsync(int companyId)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                return null;
            }

            return MapToResponseDto(company);
        }

        private CompanyResponseDto MapToResponseDto(Company company)
        {
            return new CompanyResponseDto
            {
                Id = company.Id,
                Name = company.Name,
                Domain = company.Domain,
                CustomDomain = company.CustomDomain,
                Subdomain = company.Subdomain,
                Logo = company.Logo,
                LogoSize = company.LogoSize,
                PrimaryColor = company.PrimaryColor,
                SecondaryColor = company.SecondaryColor,
                IsActive = company.IsActive,
                
                // Profile Section
                PhoneNumber = company.PhoneNumber,
                ContactEmail = company.ContactEmail,
                SenderEmail = company.SenderEmail,
                
                // Billing Information
                LegalBusinessName = company.LegalBusinessName,
                Country = company.Country,
                Region = company.Region,
                Address = company.Address,
                Apartment = company.Apartment,
                City = company.City,
                State = company.State,
                PostalCode = company.PostalCode,
                
                // Time Zone & Units
                TimeZone = company.TimeZone,
                MetricSystem = company.MetricSystem,
                WeightUnit = company.WeightUnit,
                
                // Store Currency
                Currency = company.Currency,
                
                // Order ID Format
                OrderIdPrefix = company.OrderIdPrefix,
                OrderIdSuffix = company.OrderIdSuffix,
                
                CreatedAt = company.CreatedAt,
                UpdatedAt = company.UpdatedAt
            };
        }

        public async Task<CompanyResponseDto?> UpdateCurrentCompanyAsync(UpdateCompanyRequestDto request)
        {
            // Obtener la única empresa del sistema
            var company = await _context.Companies.FirstOrDefaultAsync();

            if (company == null)
            {
                return null;
            }

            // Actualizar campos básicos - SOLO si tienen valor
            if (!string.IsNullOrEmpty(request.Name))
                company.Name = request.Name;
            
            if (request.Logo != null)
                company.Logo = request.Logo;
            
            if (!string.IsNullOrEmpty(request.PrimaryColor))
                company.PrimaryColor = request.PrimaryColor;
            
            if (!string.IsNullOrEmpty(request.SecondaryColor))
                company.SecondaryColor = request.SecondaryColor;

            // Profile Section - SOLO actualizar si se proporciona un valor (no null)
            // NO actualizar con string vacío, mantener el valor actual
            if (request.PhoneNumber != null && request.PhoneNumber != "")
                company.PhoneNumber = request.PhoneNumber;
            else if (request.PhoneNumber == "")
                company.PhoneNumber = null;
                
            if (request.ContactEmail != null && request.ContactEmail != "")
                company.ContactEmail = request.ContactEmail;
            else if (request.ContactEmail == "")
                company.ContactEmail = null;
                
            if (request.SenderEmail != null && request.SenderEmail != "")
                company.SenderEmail = request.SenderEmail;
            else if (request.SenderEmail == "")
                company.SenderEmail = null;

            // Billing Information - NO actualizar si es null
            if (request.LegalBusinessName != null && request.LegalBusinessName != "")
                company.LegalBusinessName = request.LegalBusinessName;
            else if (request.LegalBusinessName == "")
                company.LegalBusinessName = null;
                
            if (request.Country != null && request.Country != "")
                company.Country = request.Country;
            else if (request.Country == "")
                company.Country = null;
                
            if (request.Region != null && request.Region != "")
                company.Region = request.Region;
            else if (request.Region == "")
                company.Region = null;
                
            if (request.Address != null && request.Address != "")
                company.Address = request.Address;
            else if (request.Address == "")
                company.Address = null;
                
            if (request.Apartment != null && request.Apartment != "")
                company.Apartment = request.Apartment;
            else if (request.Apartment == "")
                company.Apartment = null;
                
            if (request.City != null && request.City != "")
                company.City = request.City;
            else if (request.City == "")
                company.City = null;
                
            if (request.State != null && request.State != "")
                company.State = request.State;
            else if (request.State == "")
                company.State = null;
                
            if (request.PostalCode != null && request.PostalCode != "")
                company.PostalCode = request.PostalCode;
            else if (request.PostalCode == "")
                company.PostalCode = null;

            // Time Zone & Units - NO actualizar si es null
            if (request.TimeZone != null && request.TimeZone != "")
                company.TimeZone = request.TimeZone;
            else if (request.TimeZone == "")
                company.TimeZone = null;
                
            if (request.MetricSystem != null && request.MetricSystem != "")
                company.MetricSystem = request.MetricSystem;
            else if (request.MetricSystem == "")
                company.MetricSystem = null;
                
            if (request.WeightUnit != null && request.WeightUnit != "")
                company.WeightUnit = request.WeightUnit;
            else if (request.WeightUnit == "")
                company.WeightUnit = null;

            // Store Currency - NO actualizar si es null
            if (request.Currency != null && request.Currency != "")
                company.Currency = request.Currency;
            else if (request.Currency == "")
                company.Currency = null;

            // Order ID Format - NO actualizar si es null
            if (request.OrderIdPrefix != null && request.OrderIdPrefix != "")
                company.OrderIdPrefix = request.OrderIdPrefix;
            else if (request.OrderIdPrefix == "")
                company.OrderIdPrefix = null;
                
            if (request.OrderIdSuffix != null && request.OrderIdSuffix != "")
                company.OrderIdSuffix = request.OrderIdSuffix;
            else if (request.OrderIdSuffix == "")
                company.OrderIdSuffix = null;

            company.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Company {CompanyId} updated successfully", company.Id);
                
                return await GetCurrentCompanyAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating company {CompanyId}", company.Id);
                throw;
            }
        }

        public async Task<string> UploadLogoAsync(IFormFile file)
        {
            // Obtener la única empresa
            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company == null)
            {
                throw new InvalidOperationException("No company configuration found");
            }

            // Crear directorio si no existe
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "company");
            Directory.CreateDirectory(uploadsPath);

            // Generar nombre único para el archivo
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"logo_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Guardar archivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Actualizar empresa con la URL del logo
            var logoUrl = $"/uploads/company/{fileName}";
            if (company != null)
            {
                // Eliminar logo anterior si existe
                if (!string.IsNullOrEmpty(company.Logo))
                {
                    var oldLogoPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", company.Logo.TrimStart('/'));
                    if (File.Exists(oldLogoPath))
                    {
                        File.Delete(oldLogoPath);
                    }
                }

                company.Logo = logoUrl;
                company.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Logo uploaded for company: {LogoUrl}", logoUrl);
            return logoUrl;
        }

        public async Task<CompanyConfigDto?> GetCompanyConfigAsync()
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                return null;
            }

            return new CompanyConfigDto
            {
                Name = currentCompany.Name,
                Logo = currentCompany.Logo,
                LogoSize = currentCompany.LogoSize,
                PrimaryColor = currentCompany.PrimaryColor ?? "#22c55e",
                SecondaryColor = currentCompany.SecondaryColor ?? "#64748b",
                Currency = currentCompany.Currency ?? "USD",
                TimeZone = currentCompany.TimeZone,
                OrderIdPrefix = currentCompany.OrderIdPrefix ?? "#",
                OrderIdSuffix = currentCompany.OrderIdSuffix ?? ""
            };
        }

        public async Task UpdateLogoSizeAsync(int size)
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany != null)
            {
                currentCompany.LogoSize = size;
                currentCompany.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateLogoAsync(string logoUrl)
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany != null)
            {
                currentCompany.Logo = logoUrl;
                currentCompany.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Logo updated for company {CompanyId}: {LogoUrl}", currentCompany.Id, logoUrl);
            }
        }

        #region Checkout Settings Methods

        public async Task<CheckoutSettingsDto?> GetCheckoutSettingsAsync()
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                return null;
            }

            var settings = await _context.CheckoutSettings
                .FirstOrDefaultAsync(cs => cs.CompanyId == currentCompany.Id);

            if (settings == null)
            {
                return null;
            }

            return MapToDto(settings);
        }

        public async Task<CheckoutSettingsDto> CreateDefaultCheckoutSettingsAsync()
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                throw new InvalidOperationException("No company found in the system");
            }

            // Check if settings already exist
            var existingSettings = await _context.CheckoutSettings
                .FirstOrDefaultAsync(cs => cs.CompanyId == currentCompany.Id);
            
            if (existingSettings != null)
            {
                return MapToDto(existingSettings);
            }

            // Create default settings
            var defaultSettings = new CheckoutSettings
            {
                CompanyId = currentCompany.Id,
                ContactMethod = "email",
                FullNameOption = "firstAndLast",
                CompanyNameField = "optional",
                AddressLine2Field = "optional",
                PhoneNumberField = "optional",
                RequireShippingAddress = true,
                RequireBillingAddress = true,
                AllowGuestCheckout = true,
                CollectMarketingConsent = false,
                ShowTermsAndConditions = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CheckoutSettings.Add(defaultSettings);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Default checkout settings created for company {CompanyId}", currentCompany.Id);
            return MapToDto(defaultSettings);
        }

        public async Task<CheckoutSettingsDto> UpdateCheckoutSettingsAsync(UpdateCheckoutSettingsDto request)
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                throw new InvalidOperationException("No company found in the system");
            }

            var settings = await _context.CheckoutSettings
                .FirstOrDefaultAsync(cs => cs.CompanyId == currentCompany.Id);

            if (settings == null)
            {
                // Create new settings if they don't exist
                settings = new CheckoutSettings
                {
                    CompanyId = currentCompany.Id,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CheckoutSettings.Add(settings);
            }

            // Update settings from request
            settings.ContactMethod = request.ContactMethod;
            settings.FullNameOption = request.FullNameOption;
            settings.CompanyNameField = request.CompanyNameField;
            settings.AddressLine2Field = request.AddressLine2Field;
            settings.PhoneNumberField = request.PhoneNumberField;
            settings.RequireShippingAddress = request.RequireShippingAddress;
            settings.RequireBillingAddress = request.RequireBillingAddress;
            settings.AllowGuestCheckout = request.AllowGuestCheckout;
            settings.CollectMarketingConsent = request.CollectMarketingConsent;
            settings.ShowTermsAndConditions = request.ShowTermsAndConditions;
            settings.TermsAndConditionsUrl = request.TermsAndConditionsUrl;
            settings.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Checkout settings updated for company {CompanyId}", currentCompany.Id);
            return MapToDto(settings);
        }

        public async Task<CheckoutSettingsDto> ResetCheckoutSettingsAsync()
        {
            var currentCompany = await _context.Companies.FirstOrDefaultAsync();
            if (currentCompany == null)
            {
                throw new InvalidOperationException("No company found in the system");
            }

            var settings = await _context.CheckoutSettings
                .FirstOrDefaultAsync(cs => cs.CompanyId == currentCompany.Id);

            if (settings != null)
            {
                // Reset to default values
                settings.ContactMethod = "email";
                settings.FullNameOption = "firstAndLast";
                settings.CompanyNameField = "optional";
                settings.AddressLine2Field = "optional";
                settings.PhoneNumberField = "optional";
                settings.RequireShippingAddress = true;
                settings.RequireBillingAddress = true;
                settings.AllowGuestCheckout = true;
                settings.CollectMarketingConsent = false;
                settings.ShowTermsAndConditions = true;
                settings.TermsAndConditionsUrl = null;
                settings.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Checkout settings reset for company {CompanyId}", currentCompany.Id);
                return MapToDto(settings);
            }
            else
            {
                // Create default settings if they don't exist
                return await CreateDefaultCheckoutSettingsAsync();
            }
        }

        private CheckoutSettingsDto MapToDto(CheckoutSettings settings)
        {
            return new CheckoutSettingsDto
            {
                Id = settings.Id,
                CompanyId = settings.CompanyId,
                ContactMethod = settings.ContactMethod,
                FullNameOption = settings.FullNameOption,
                CompanyNameField = settings.CompanyNameField,
                AddressLine2Field = settings.AddressLine2Field,
                PhoneNumberField = settings.PhoneNumberField,
                RequireShippingAddress = settings.RequireShippingAddress,
                RequireBillingAddress = settings.RequireBillingAddress,
                AllowGuestCheckout = settings.AllowGuestCheckout,
                CollectMarketingConsent = settings.CollectMarketingConsent,
                ShowTermsAndConditions = settings.ShowTermsAndConditions,
                TermsAndConditionsUrl = settings.TermsAndConditionsUrl,
                CreatedAt = settings.CreatedAt,
                UpdatedAt = settings.UpdatedAt
            };
        }

        #endregion
    }
}