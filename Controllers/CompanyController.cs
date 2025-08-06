using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteBuilderAPI.Attributes;
using WebsiteBuilderAPI.DTOs.Company;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly ILogger<CompanyController> _logger;

        public CompanyController(ICompanyService companyService, ILogger<CompanyController> logger)
        {
            _companyService = companyService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene la información del company actual (mi empresa)
        /// </summary>
        [HttpGet("current")]
        [RequirePermission("company", "read")]
        public async Task<ActionResult<CompanyResponseDto>> GetCurrentCompany()
        {
            try
            {
                var company = await _companyService.GetCurrentCompanyAsync();
                if (company == null)
                {
                    return NotFound(new { message = "Company not found" });
                }

                return Ok(company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current company");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Actualiza la información del company actual
        /// </summary>
        [HttpPut("current")]
        [RequirePermission("company", "update")]
        public async Task<ActionResult<CompanyResponseDto>> UpdateCurrentCompany([FromBody] UpdateCompanyRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedCompany = await _companyService.UpdateCurrentCompanyAsync(request);
                if (updatedCompany == null)
                {
                    return NotFound(new { message = "Company not found" });
                }

                return Ok(updatedCompany);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating current company");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Actualiza solo el logo del company
        /// </summary>
        [HttpPut("current/logo")]
        [RequirePermission("company", "update")]
        public async Task<ActionResult> UpdateLogo([FromBody] UpdateLogoDto request)
        {
            try
            {
                await _companyService.UpdateLogoAsync(request.Logo);
                return Ok(new { message = "Logo updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating logo");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Sube el logo del company
        /// </summary>
        [HttpPost("current/logo")]
        [RequirePermission("company", "update")]
        public async Task<ActionResult<string>> UploadLogo(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file provided" });
                }

                // Validar tipo de archivo
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest(new { message = "Invalid file type. Only JPEG, PNG and GIF are allowed." });
                }

                // Validar tamaño (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File too large. Maximum size is 5MB." });
                }

                var logoUrl = await _companyService.UploadLogoAsync(file);
                return Ok(new { logoUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading logo");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Actualiza el tamaño del logo del company
        /// </summary>
        [HttpPut("current/logo-size")]
        [RequirePermission("company", "update")]
        public async Task<ActionResult> UpdateLogoSize([FromBody] UpdateLogoSizeDto request)
        {
            try
            {
                if (request.Size < 60 || request.Size > 200)
                {
                    return BadRequest(new { message = "Logo size must be between 60 and 200 pixels" });
                }

                await _companyService.UpdateLogoSizeAsync(request.Size);
                return Ok(new { message = "Logo size updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating logo size");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Obtiene configuración básica del company para el frontend
        /// </summary>
        [HttpGet("config")]
        [AllowAnonymous]
        public async Task<ActionResult<CompanyConfigDto>> GetCompanyConfig()
        {
            try
            {
                var config = await _companyService.GetCompanyConfigAsync();
                if (config == null)
                {
                    return NotFound(new { message = "Company configuration not found" });
                }

                return Ok(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting company config");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}