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

            // Actualizar campos básicos
            if (!string.IsNullOrEmpty(request.Name))
                company.Name = request.Name;
            
            if (request.PrimaryColor != null)
                company.PrimaryColor = request.PrimaryColor;
            
            if (request.SecondaryColor != null)
                company.SecondaryColor = request.SecondaryColor;

            // Profile Section
            company.PhoneNumber = request.PhoneNumber;
            company.ContactEmail = request.ContactEmail;
            company.SenderEmail = request.SenderEmail;

            // Billing Information
            company.LegalBusinessName = request.LegalBusinessName;
            company.Country = request.Country;
            company.Region = request.Region;
            company.Address = request.Address;
            company.Apartment = request.Apartment;
            company.City = request.City;
            company.State = request.State;
            company.PostalCode = request.PostalCode;

            // Time Zone & Units
            company.TimeZone = request.TimeZone;
            company.MetricSystem = request.MetricSystem;
            company.WeightUnit = request.WeightUnit;

            // Store Currency
            company.Currency = request.Currency;

            // Order ID Format
            company.OrderIdPrefix = request.OrderIdPrefix;
            company.OrderIdSuffix = request.OrderIdSuffix;

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
                PrimaryColor = currentCompany.PrimaryColor ?? "#22c55e",
                SecondaryColor = currentCompany.SecondaryColor ?? "#64748b",
                Currency = currentCompany.Currency ?? "USD",
                TimeZone = currentCompany.TimeZone,
                OrderIdPrefix = currentCompany.OrderIdPrefix ?? "#",
                OrderIdSuffix = currentCompany.OrderIdSuffix ?? ""
            };
        }
    }
}