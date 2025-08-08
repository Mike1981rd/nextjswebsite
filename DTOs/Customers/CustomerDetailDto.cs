using System.Collections.Generic;

namespace WebsiteBuilderAPI.DTOs.Customers
{
    public class CustomerDetailDto : CustomerDto
    {
        public List<CustomerAddressDto> Addresses { get; set; }
        public List<CustomerPaymentMethodDto> PaymentMethods { get; set; }
        public List<CustomerNotificationPreferenceDto> NotificationPreferences { get; set; }
        public List<CustomerDeviceDto> RecentDevices { get; set; }
        public List<CustomerWishlistItemDto> WishlistItems { get; set; }
        public List<CustomerCouponDto> Coupons { get; set; }
        
        // Additional details for the detail view
        public string? TwoFactorPhone { get; set; }
        
        public CustomerDetailDto()
        {
            Addresses = new List<CustomerAddressDto>();
            PaymentMethods = new List<CustomerPaymentMethodDto>();
            NotificationPreferences = new List<CustomerNotificationPreferenceDto>();
            RecentDevices = new List<CustomerDeviceDto>();
            WishlistItems = new List<CustomerWishlistItemDto>();
            Coupons = new List<CustomerCouponDto>();
        }
    }
}