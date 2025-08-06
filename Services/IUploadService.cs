using Microsoft.AspNetCore.Http;

namespace WebsiteBuilderAPI.Services
{
    public interface IUploadService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task DeleteImageAsync(string fileUrl);
    }
}