using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.Repositories;
using WebsiteBuilderAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configurar Npgsql DataSource con soporte para JSON dinámico
var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("DefaultConnection"));
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(dataSource));

// Configurar JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "WebsiteBuilderAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "WebsiteBuilderClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Configurar CORS para permitir peticiones desde el frontend Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Registrar servicios
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();

// Servicios de empresa
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IShippingService, ShippingService>();
builder.Services.AddScoped<IPaymentProviderService, PaymentProviderService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<INotificationSettingsService, NotificationSettingsService>();
builder.Services.AddScoped<WebsiteBuilderAPI.Services.Encryption.IEncryptionService, WebsiteBuilderAPI.Services.Encryption.EncryptionService>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICollectionService, CollectionService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<INewsletterSubscriberService, NewsletterSubscriberService>();
builder.Services.AddScoped<IPaginasService, PaginasService>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddScoped<INavigationMenuService, NavigationMenuService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Servicios de pagos
builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IPaymentProviderRepository, PaymentProviderRepository>();
builder.Services.AddScoped<IAzulPaymentService, AzulPaymentService>();

// Configurar HttpClient para Azul
builder.Services.AddHttpClient<IAzulPaymentService, AzulPaymentService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Evitar referencias circulares
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Configure FormOptions for file uploads
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "WebsiteBuilder API",
        Version = "v1",
        Description = "API para el sistema de hotel + e-commerce + website builder"
    });

    // Configurar JWT en Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Middleware de logging temporal para depuración
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"=== ERROR CAPTURADO ===");
        Console.WriteLine($"Path: {context.Request.Path}");
        Console.WriteLine($"Method: {context.Request.Method}");
        Console.WriteLine($"Error: {ex.Message}");
        Console.WriteLine($"Inner: {ex.InnerException?.Message}");
        Console.WriteLine($"StackTrace: {ex.StackTrace}");
        Console.WriteLine($"======================");
        throw; // Re-throw para que siga el flujo normal
    }
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebsiteBuilder API v1");
    });
}

// Usar CORS
app.UseCors("AllowNextJsApp");

// Servir archivos estáticos desde wwwroot (incluye /uploads)
app.UseStaticFiles();

app.UseAuthentication();

// Middleware temporal para permitir acceso sin auth a endpoints de pago y shipping
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value?.ToLower() ?? "";
    if (path.Contains("/api/paymentprovider") || path.Contains("/api/payment") || path.Contains("/api/shipping"))
    {
        // Permitir acceso sin autenticación temporalmente
        await next();
        return;
    }
    await next();
});

app.UseAuthorization();

app.MapControllers();

// Inicializar base de datos
await InitializeDatabaseAsync(app);

app.Run();

async Task InitializeDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Aplicar migraciones
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Migraciones aplicadas exitosamente");
        
        // Ejecutar seed data
        await SeedData.InitializeAsync(scope.ServiceProvider);
        logger.LogInformation("Datos semilla creados exitosamente");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error al inicializar la base de datos");
    }
}
