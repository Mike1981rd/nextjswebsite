namespace WebsiteBuilderAPI.DTOs.Customers
{
    public class CustomerNotificationPreferenceDto
    {
        public int Id { get; set; }
        public string NotificationType { get; set; }
        public string DisplayName { get; set; }
        public string? Description { get; set; }
        public bool EmailEnabled { get; set; }
        public bool BrowserEnabled { get; set; }
        public bool AppEnabled { get; set; }
    }
}