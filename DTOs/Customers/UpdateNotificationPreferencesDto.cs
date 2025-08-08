using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebsiteBuilderAPI.DTOs.Customers
{
    public class UpdateNotificationPreferencesDto
    {
        [Required(ErrorMessage = "Preferences list is required")]
        public List<NotificationPreferenceDto> Preferences { get; set; }
        
        public UpdateNotificationPreferencesDto()
        {
            Preferences = new List<NotificationPreferenceDto>();
        }
    }
    
    public class NotificationPreferenceDto
    {
        [Required(ErrorMessage = "Notification type is required")]
        public string NotificationType { get; set; }
        
        public bool EmailEnabled { get; set; }
        public bool BrowserEnabled { get; set; }
        public bool AppEnabled { get; set; }
    }
}