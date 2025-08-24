using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.DTOs.Checkout;
using WebsiteBuilderAPI.DTOs.Customers;
using WebsiteBuilderAPI.DTOs;
using WebsiteBuilderAPI.Models;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customerService;
        private readonly IReservationService _reservationService;
        private readonly IEmailService _emailService;
        private readonly ICompanyService _companyService;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(
            ApplicationDbContext context,
            ICustomerService customerService,
            IReservationService reservationService,
            IEmailService emailService,
            ICompanyService companyService,
            ILogger<CheckoutController> logger)
        {
            _context = context;
            _customerService = customerService;
            _reservationService = reservationService;
            _emailService = emailService;
            _companyService = companyService;
            _logger = logger;
        }

        /// <summary>
        /// Get checkout configuration settings
        /// </summary>
        [HttpGet("checkout-settings")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCheckoutSettings()
        {
            try
            {
                var settings = await _companyService.GetCheckoutSettingsAsync();
                return Ok(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting checkout settings");
                // Return default settings if there's an error
                return Ok(new 
                {
                    phoneNumberField = "optional",
                    companyNameField = "optional",
                    apartmentSuiteField = "optional",
                    allowGuestCheckout = true,
                    showOrderComments = true,
                    showCompanyField = false
                });
            }
        }

        /// <summary>
        /// Process a room reservation from checkout page
        /// Creates/updates customer and creates reservation
        /// </summary>
        [HttpPost("process-room-reservation")]
        [AllowAnonymous]
        public async Task<ActionResult<ProcessRoomReservationResponseDto>> ProcessRoomReservation(
            [FromBody] ProcessRoomReservationDto dto)
        {
            // Log incoming data for debugging
            _logger.LogInformation("=== CHECKOUT REQUEST RECEIVED ===");
            _logger.LogInformation("Email: {Email}", dto?.Email ?? "NULL");
            _logger.LogInformation("FirstName: {FirstName}", dto?.FirstName ?? "NULL");
            _logger.LogInformation("LastName: {LastName}", dto?.LastName ?? "NULL");
            _logger.LogInformation("Country: {Country}", dto?.Country ?? "NULL");
            _logger.LogInformation("RoomId: {RoomId}", dto?.RoomId ?? 0);
            _logger.LogInformation("CheckInDate: {CheckInDate}", dto?.CheckInDate);
            _logger.LogInformation("CheckOutDate: {CheckOutDate}", dto?.CheckOutDate);
            _logger.LogInformation("Guests: {Guests}", dto?.NumberOfGuests ?? 0);
            _logger.LogInformation("TotalAmount: {TotalAmount}", dto?.TotalAmount ?? 0);
            _logger.LogInformation("PaymentMethod: {PaymentMethod}", dto?.PaymentMethod ?? "NULL");
            _logger.LogInformation("CardNumber present: {HasCard}", !string.IsNullOrEmpty(dto?.CardNumber));
            _logger.LogInformation("CVV present: {HasCVV}", !string.IsNullOrEmpty(dto?.CVV));
            _logger.LogInformation("=================================");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (!ModelState.IsValid)
                {
                    // Log all validation errors
                    _logger.LogError("VALIDATION FAILED - ModelState Errors:");
                    foreach (var modelError in ModelState)
                    {
                        foreach (var error in modelError.Value.Errors)
                        {
                            _logger.LogError("Field: {Field}, Error: {Error}", modelError.Key, error.ErrorMessage);
                        }
                    }
                    
                    var allErrors = string.Join("; ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    
                    return BadRequest(new ProcessRoomReservationResponseDto
                    {
                        Success = false,
                        Message = "Invalid data provided",
                        Error = new ProcessReservationErrorDto
                        {
                            Code = "VALIDATION_ERROR",
                            Description = allErrors.Length > 0 ? allErrors : "Validation failed"
                        }
                    });
                }

                // Get company ID from request or default
                var companyIdHeader = Request.Headers["X-Company-Id"].FirstOrDefault();
                int companyId = !string.IsNullOrEmpty(companyIdHeader) 
                    ? int.Parse(companyIdHeader) 
                    : 1; // Default company

                // Validate checkout settings requirements
                var checkoutSettings = await _companyService.GetCheckoutSettingsAsync();
                if (checkoutSettings != null)
                {
                    // Validate phone if required
                    if (checkoutSettings.PhoneNumberField == "required" && string.IsNullOrEmpty(dto.Phone))
                    {
                        return BadRequest(new ProcessRoomReservationResponseDto
                        {
                            Success = false,
                            Message = "Phone number is required",
                            Error = new ProcessReservationErrorDto
                            {
                                Code = "PHONE_REQUIRED",
                                Field = "phone",
                                Description = "Phone number is required based on checkout settings"
                            }
                        });
                    }

                    // Validate company name if required
                    if (checkoutSettings.CompanyNameField == "required" && string.IsNullOrEmpty(dto.CompanyName))
                    {
                        return BadRequest(new ProcessRoomReservationResponseDto
                        {
                            Success = false,
                            Message = "Company name is required",
                            Error = new ProcessReservationErrorDto
                            {
                                Code = "COMPANY_NAME_REQUIRED",
                                Field = "companyName",
                                Description = "Company name is required based on checkout settings"
                            }
                        });
                    }

                    // Check if guest checkout is allowed
                    if (!checkoutSettings.AllowGuestCheckout && !dto.CreateAccount)
                    {
                        return BadRequest(new ProcessRoomReservationResponseDto
                        {
                            Success = false,
                            Message = "Account creation is required",
                            Error = new ProcessReservationErrorDto
                            {
                                Code = "ACCOUNT_REQUIRED",
                                Description = "Guest checkout is not allowed. Please create an account."
                            }
                        });
                    }
                }

                // Validate password if creating account
                if (dto.CreateAccount && string.IsNullOrEmpty(dto.Password))
                {
                    return BadRequest(new ProcessRoomReservationResponseDto
                    {
                        Success = false,
                        Message = "Password is required when creating an account",
                        Error = new ProcessReservationErrorDto
                        {
                            Code = "PASSWORD_REQUIRED",
                            Field = "password",
                            Description = "Password is required when creating an account"
                        }
                    });
                }

                // Verify room availability
                var room = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.Id == dto.RoomId && r.CompanyId == companyId);

                if (room == null)
                {
                    return NotFound(new ProcessRoomReservationResponseDto
                    {
                        Success = false,
                        Message = "Room not found",
                        Error = new ProcessReservationErrorDto
                        {
                            Code = "ROOM_NOT_FOUND",
                            Description = "The selected room is not available"
                        }
                    });
                }

                // Check availability for the dates
                var isAvailable = await CheckRoomAvailability(dto.RoomId, dto.CheckInDate, dto.CheckOutDate);
                if (!isAvailable)
                {
                    return BadRequest(new ProcessRoomReservationResponseDto
                    {
                        Success = false,
                        Message = "Room is not available for selected dates",
                        Error = new ProcessReservationErrorDto
                        {
                            Code = "ROOM_NOT_AVAILABLE",
                            Description = "The room is not available for the selected dates"
                        }
                    });
                }

                // Step 1: Create or update customer
                _logger.LogInformation("Processing customer for email: {Email}", dto.Email);
                
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == dto.Email && c.CompanyId == companyId);

                bool accountCreated = false;
                bool passwordEmailSent = false;
                string temporaryPassword = null;

                if (customer == null)
                {
                    // Create new customer
                    _logger.LogInformation("Creating new customer for email: {Email}", dto.Email);
                    
                    string password;
                    if (dto.CreateAccount)
                    {
                        // Customer chose to create account with their own password
                        password = dto.Password;
                        accountCreated = true;
                    }
                    else
                    {
                        // Generate temporary password for guest checkout
                        password = GenerateTemporaryPassword();
                        temporaryPassword = password;
                        passwordEmailSent = true;
                    }

                    customer = new Customer
                    {
                        Username = dto.Email, // Username IS the email for user-friendliness
                        Email = dto.Email,
                        PasswordHash = HashPassword(password),
                        FirstName = dto.FirstName,
                        LastName = dto.LastName ?? "",
                        Phone = dto.Phone,
                        Country = dto.Country,
                        CompanyName = dto.CompanyName,
                        TaxId = dto.TaxId,
                        Status = "Active",
                        CompanyId = companyId,
                        CustomerId = GenerateCustomerId(),
                        PreferredCurrency = dto.Currency,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation("Customer created with ID: {CustomerId}", customer.Id);

                    // Create customer address if provided
                    if (!string.IsNullOrEmpty(dto.Address))
                    {
                        var address = new CustomerAddress
                        {
                            CustomerId = customer.Id,
                            Type = "Billing",
                            Label = $"{dto.FirstName} {dto.LastName} - Billing",
                            Street = dto.Address,
                            Apartment = dto.Apartment,
                            City = dto.City ?? "",
                            State = dto.State,
                            PostalCode = dto.PostalCode ?? "",
                            Country = dto.Country,
                            IsDefault = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.CustomerAddresses.Add(address);
                        await _context.SaveChangesAsync();
                    }

                    // Send welcome email with credentials
                    if (!dto.CreateAccount && !string.IsNullOrEmpty(temporaryPassword))
                    {
                        await SendWelcomeEmailWithCredentials(dto.Email, temporaryPassword);
                    }
                    else if (dto.CreateAccount)
                    {
                        await SendWelcomeEmail(dto.Email, dto.FirstName);
                    }
                }
                else
                {
                    // Update existing customer data
                    _logger.LogInformation("Updating existing customer ID: {CustomerId}", customer.Id);
                    
                    customer.Phone = dto.Phone ?? customer.Phone;
                    customer.Country = dto.Country;
                    customer.FirstName = dto.FirstName;
                    customer.LastName = dto.LastName ?? customer.LastName;
                    customer.CompanyName = dto.CompanyName ?? customer.CompanyName;
                    customer.TaxId = dto.TaxId ?? customer.TaxId;
                    customer.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                }

                // Step 2: Create reservation
                _logger.LogInformation("Creating reservation for customer ID: {CustomerId}", customer.Id);
                
                var reservation = new Reservation
                {
                    CompanyId = companyId,
                    CustomerId = customer.Id,
                    RoomId = dto.RoomId,
                    CheckInDate = dto.CheckInDate.Date,
                    CheckOutDate = dto.CheckOutDate.Date,
                    NumberOfGuests = dto.NumberOfGuests,
                    RoomRate = dto.RoomRate,
                    TotalAmount = dto.TotalAmount,
                    SpecialRequests = dto.SpecialRequests,
                    Status = "Pending", // Will be updated to Confirmed after payment
                    InternalNotes = $"Comprobante Fiscal: {GetComprobanteFiscalName(dto.TaxDocumentType)}" + 
                                   (dto.TaxId != null ? $" - RNC/Cédula: {dto.TaxId}" : ""),
                    CreatedAt = DateTime.UtcNow
                };

                // Calculate number of nights
                reservation.CalculateNights();

                // Add billing address if different from default
                if (!string.IsNullOrEmpty(dto.Address) && dto.TaxDocumentType != "consumidor_final")
                {
                    reservation.CustomBillingAddress = dto.Address;
                    reservation.CustomBillingCity = dto.City;
                    reservation.CustomBillingState = dto.State;
                    reservation.CustomBillingPostalCode = dto.PostalCode;
                    reservation.CustomBillingCountry = dto.Country;
                }

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Reservation created with ID: {ReservationId}", reservation.Id);

                // Step 3: Process payment (simplified for now - in real implementation, integrate with payment gateway)
                bool paymentSuccess = await ProcessPayment(reservation.Id, dto);
                
                if (paymentSuccess)
                {
                    // Update reservation status to confirmed
                    reservation.Status = "Confirmed";
                    await _context.SaveChangesAsync();

                    // Step 4: Update room availability calendar
                    await UpdateRoomAvailability(dto.RoomId, dto.CheckInDate, dto.CheckOutDate);

                    // Step 5: Send confirmation emails
                    await SendReservationConfirmation(customer.Email, reservation, room);

                    // Commit transaction
                    await transaction.CommitAsync();

                    _logger.LogInformation("Reservation process completed successfully for reservation ID: {ReservationId}", reservation.Id);

                    return Ok(new ProcessRoomReservationResponseDto
                    {
                        Success = true,
                        Message = "Reservation confirmed successfully",
                        ReservationId = reservation.Id,
                        CustomerId = customer.Id,
                        ConfirmationNumber = $"RES{reservation.Id:D6}",
                        CustomerEmail = customer.Email,
                        AccountCreated = accountCreated,
                        PasswordEmailSent = passwordEmailSent
                    });
                }
                else
                {
                    // Payment failed - rollback
                    await transaction.RollbackAsync();
                    
                    return BadRequest(new ProcessRoomReservationResponseDto
                    {
                        Success = false,
                        Message = "Payment processing failed",
                        Error = new ProcessReservationErrorDto
                        {
                            Code = "PAYMENT_FAILED",
                            Description = "Unable to process payment. Please check your card details and try again."
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error processing room reservation");
                
                return StatusCode(500, new ProcessRoomReservationResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing your reservation",
                    Error = new ProcessReservationErrorDto
                    {
                        Code = "INTERNAL_ERROR",
                        Description = "An unexpected error occurred. Please try again later."
                    }
                });
            }
        }

        private async Task<bool> CheckRoomAvailability(int roomId, DateTime checkIn, DateTime checkOut)
        {
            // Check if there are any confirmed reservations overlapping with these dates
            var hasConflict = await _context.Reservations
                .AnyAsync(r => r.RoomId == roomId 
                    && (r.Status == "Confirmed" || r.Status == "CheckedIn")
                    && r.CheckInDate < checkOut 
                    && r.CheckOutDate > checkIn);
                    
            return !hasConflict;
        }

        private async Task UpdateRoomAvailability(int roomId, DateTime checkIn, DateTime checkOut)
        {
            // Here you would update your availability calendar
            // This is a simplified version - in production you'd have a proper availability table
            _logger.LogInformation("Room {RoomId} blocked from {CheckIn} to {CheckOut}", 
                roomId, checkIn, checkOut);
            
            // TODO: Implement actual availability calendar update
            await Task.CompletedTask;
        }

        private async Task<bool> ProcessPayment(int reservationId, ProcessRoomReservationDto dto)
        {
            try
            {
                // This is a simplified payment processing
                // In production, you would integrate with a payment gateway like Stripe, PayPal, etc.
                
                _logger.LogInformation("Processing payment for reservation {ReservationId}", reservationId);
                
                // Get current user ID if authenticated
                var currentUserId = User?.Identity?.IsAuthenticated == true 
                    ? int.TryParse(User.FindFirst("userId")?.Value, out var id) ? id : (int?)null
                    : null;
                
                // Create payment record using only existing model properties
                var payment = new ReservationPayment
                {
                    ReservationId = reservationId,
                    Amount = dto.TotalAmount, // Using TotalAmount from dto
                    PaymentMethod = dto.PaymentMethod,
                    Status = "Completed", // In production, this would depend on actual payment processing
                    PaymentDate = DateTime.UtcNow,
                    TransactionId = $"TXN-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    Notes = $"Payment for reservation #{reservationId:D6}. Method: {dto.PaymentMethod}. " +
                           $"Card: ****{(dto.CardNumber?.Length >= 4 ? dto.CardNumber.Substring(dto.CardNumber.Length - 4) : "****")}",
                    ProcessedByUserId = currentUserId
                };
                
                _context.ReservationPayments.Add(payment);
                await _context.SaveChangesAsync();
                
                // Simulate payment processing delay
                await Task.Delay(500);
                
                // For testing, always return true
                // In production, this would depend on the payment gateway response
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment for reservation {ReservationId}", reservationId);
                return false;
            }
        }

        private string GenerateCustomerId()
        {
            // Generate a unique customer ID like #895280
            var random = new Random();
            return $"#{random.Next(100000, 999999)}";
        }

        private string GenerateTemporaryPassword()
        {
            // Generate a secure temporary password
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#";
            var random = new Random();
            var password = new char[12];
            
            for (int i = 0; i < password.Length; i++)
            {
                password[i] = chars[random.Next(chars.Length)];
            }
            
            // Ensure it has at least one uppercase, lowercase, number and special char
            password[0] = "ABCDEFGHJKLMNPQRSTUVWXYZ"[random.Next(25)];
            password[1] = "abcdefghijkmnpqrstuvwxyz"[random.Next(25)];
            password[2] = "23456789"[random.Next(8)];
            password[3] = "!@#"[random.Next(3)];
            
            return new string(password);
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private async Task SendWelcomeEmailWithCredentials(string email, string temporaryPassword)
        {
            try
            {
                await _emailService.SendEmailAsync(
                    email,
                    "Reservation Confirmed - Your Account Details",
                    $@"
                    <h2>Your reservation has been confirmed!</h2>
                    <p>We've created an account for you to manage your reservation.</p>
                    <h3>Your login credentials:</h3>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Temporary Password:</strong> {temporaryPassword}</p>
                    <p>For security, please change your password after your first login.</p>
                    <p><a href='http://localhost:3000/login'>Login to your account</a></p>
                    ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to {Email}", email);
            }
        }

        private async Task SendWelcomeEmail(string email, string firstName)
        {
            try
            {
                await _emailService.SendEmailAsync(
                    email,
                    "Welcome - Account Created Successfully",
                    $@"
                    <h2>Welcome {firstName}!</h2>
                    <p>Your account has been created successfully.</p>
                    <p>You can now login with your email and the password you chose.</p>
                    <p><a href='http://localhost:3000/login'>Login to your account</a></p>
                    ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to {Email}", email);
            }
        }

        private async Task SendReservationConfirmation(string email, Reservation reservation, Room room)
        {
            try
            {
                var confirmationNumber = $"RES{reservation.Id:D6}";
                await _emailService.SendEmailAsync(
                    email,
                    $"Reservation Confirmed - {confirmationNumber}",
                    $@"
                    <h2>Reservation Confirmed!</h2>
                    <p><strong>Confirmation Number:</strong> {confirmationNumber}</p>
                    <h3>Reservation Details:</h3>
                    <p><strong>Room:</strong> {room.Name}</p>
                    <p><strong>Check-in:</strong> {reservation.CheckInDate:MMMM dd, yyyy}</p>
                    <p><strong>Check-out:</strong> {reservation.CheckOutDate:MMMM dd, yyyy}</p>
                    <p><strong>Guests:</strong> {reservation.NumberOfGuests}</p>
                    <p><strong>Total Amount:</strong> ${reservation.TotalAmount:F2}</p>
                    <p>We look forward to welcoming you!</p>
                    ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reservation confirmation to {Email}", email);
            }
        }

        private string GetComprobanteFiscalName(string taxDocumentType)
        {
            return taxDocumentType?.ToLower() switch
            {
                "consumidor_final" => "Consumidor Final",
                "credito_fiscal" => "Crédito Fiscal",
                "gubernamental" => "Gubernamental",
                "regimen_especial" => "Régimen Especial",
                _ => "Consumidor Final"
            };
        }
    }
}