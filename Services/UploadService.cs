using Microsoft.AspNetCore.Http;

namespace WebsiteBuilderAPI.Services
{
    public class UploadService : IUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UploadService(
            IWebHostEnvironment environment,
            ILogger<UploadService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _environment = environment;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                // Crear directorio de uploads si no existe
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "logos");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generar nombre único para el archivo
                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Guardar el archivo
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Retornar la ruta relativa
                var fileUrl = $"/uploads/logos/{uniqueFileName}";

                _logger.LogInformation($"Imagen subida exitosamente: {fileUrl}");
                return fileUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir imagen");
                throw;
            }
        }

        public async Task DeleteImageAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return;

                // Manejar URLs relativas y absolutas
                string fileName;
                if (fileUrl.StartsWith("http://") || fileUrl.StartsWith("https://"))
                {
                    var uri = new Uri(fileUrl);
                    fileName = Path.GetFileName(uri.LocalPath);
                }
                else
                {
                    // Es una ruta relativa
                    fileName = Path.GetFileName(fileUrl);
                }
                
                var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "logos", fileName);

                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                    _logger.LogInformation($"Imagen eliminada: {filePath}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar imagen");
                throw;
            }
        }
    }
}