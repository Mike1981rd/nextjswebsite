using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.DTOs.Company;
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

            return new CompanyResponseDto
            {
                Id = currentCompany.Id,
                Name = currentCompany.Name,
                Domain = currentCompany.Domain,
                CustomDomain = currentCompany.CustomDomain,
                Subdomain = currentCompany.Subdomain,
                Logo = currentCompany.Logo,
                LogoSize = currentCompany.LogoSize,
                PrimaryColor = currentCompany.PrimaryColor,
                SecondaryColor = currentCompany.SecondaryColor,
                IsActive = currentCompany.IsActive,
                
                // Profile Section
                PhoneNumber = currentCompany.PhoneNumber,
                ContactEmail = currentCompany.ContactEmail,
                SenderEmail = currentCompany.SenderEmail,
                
                // Billing Information
                LegalBusinessName = currentCompany.LegalBusinessName,
                Country = currentCompany.Country,
                Region = currentCompany.Region,
                Address = currentCompany.Address,
                Apartment = currentCompany.Apartment,
                City = currentCompany.City,
                State = currentCompany.State,
                PostalCode = currentCompany.PostalCode,
                
                // Time Zone & Units
                TimeZone = currentCompany.TimeZone,
                MetricSystem = currentCompany.MetricSystem,
                WeightUnit = currentCompany.WeightUnit,
                
                // Store Currency
                Currency = currentCompany.Currency,
                
                // Order ID Format
                OrderIdPrefix = currentCompany.OrderIdPrefix,
                OrderIdSuffix = currentCompany.OrderIdSuffix,
                
                CreatedAt = currentCompany.CreatedAt,
                UpdatedAt = currentCompany.UpdatedAt
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
    }
}