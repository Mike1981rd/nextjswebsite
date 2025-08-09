using System.ComponentModel.DataAnnotations;

namespace WebsiteBuilderAPI.DTOs.Policies
{
    public class UpdatePolicyDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public bool IsRequired { get; set; }
        public bool IsActive { get; set; }
    }
}