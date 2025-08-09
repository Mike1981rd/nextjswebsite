using System;

namespace WebsiteBuilderAPI.DTOs.Policies
{
    public class PolicyDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsRequired { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Additional properties for UI
        public string Icon { get; set; }
        public string Description { get; set; }
    }
}