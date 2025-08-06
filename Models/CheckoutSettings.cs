using System;
using System.ComponentModel.DataAnnotations;

namespace WebsiteBuilderAPI.Models
{
    public class CheckoutSettings
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CompanyId { get; set; }

        // Customer Contact Method
        [Required]
        [MaxLength(20)]
        public string ContactMethod { get; set; } = "email"; // "phone" or "email"

        // Full Name Configuration  
        [Required]
        [MaxLength(20)]
        public string FullNameOption { get; set; } = "firstAndLast"; // "lastOnly" or "firstAndLast"

        // Field Requirements
        [Required]
        [MaxLength(20)]
        public string CompanyNameField { get; set; } = "optional"; // "hidden", "optional", "required"

        [Required]
        [MaxLength(20)]
        public string AddressLine2Field { get; set; } = "optional"; // "hidden", "optional", "required"

        [Required]
        [MaxLength(20)]
        public string PhoneNumberField { get; set; } = "optional"; // "hidden", "optional", "required"

        // Additional Settings (for future expansion)
        public bool RequireShippingAddress { get; set; } = true;
        public bool RequireBillingAddress { get; set; } = true;
        public bool AllowGuestCheckout { get; set; } = true;
        public bool CollectMarketingConsent { get; set; } = false;
        
        // Terms and Conditions
        public bool ShowTermsAndConditions { get; set; } = true;
        public string? TermsAndConditionsUrl { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Company Company { get; set; } = null!;
    }
}