using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebsiteBuilderAPI.Models
{
    public class CustomerNotificationPreference
    {
        public int Id { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string NotificationType { get; set; } // NewForYou/AccountActivity/BrowserLogin/DeviceLinked
        
        [Required]
        [StringLength(200)]
        public string DisplayName { get; set; } // Human-readable name
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool EmailEnabled { get; set; }
        public bool BrowserEnabled { get; set; }
        public bool AppEnabled { get; set; }
        
        // Navigation property
        [JsonIgnore]
        public virtual Customer Customer { get; set; }
        
        public CustomerNotificationPreference()
        {
            EmailEnabled = true; // Default to email enabled
            BrowserEnabled = true;
            AppEnabled = true;
        }
    }
}