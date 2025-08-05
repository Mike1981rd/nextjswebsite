using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebsiteBuilderAPI.DTOs.Auth;
using WebsiteBuilderAPI.Services;

namespace WebsiteBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            _logger.LogInformation($"Usuario {loginDto.Email} inició sesión exitosamente");
            return Ok(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest(new { message = "El email ya está registrado" });
            }

            _logger.LogInformation($"Nuevo usuario registrado: {registerDto.Email}");
            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var permissions = await _authService.GetUserPermissionsAsync(userId);
            
            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                HotelId = user.HotelId,
                HotelName = user.Hotel?.Name,
                Permissions = permissions
            };

            return Ok(userDto);
        }

        [HttpPost("logout")]
        [Authorize]
        public ActionResult Logout()
        {
            // En JWT, el logout se maneja del lado del cliente
            // Aquí podrías invalidar el token en una lista negra si es necesario
            _logger.LogInformation($"Usuario {User.Identity?.Name} cerró sesión");
            return Ok(new { message = "Sesión cerrada exitosamente" });
        }
    }
}