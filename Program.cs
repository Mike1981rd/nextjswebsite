using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Serilog;
using Serilog.Events;
using System.Diagnostics;
using System.Text;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.Repositories;
using WebsiteBuilderAPI.Services;

// Configurar Serilog ANTES de crear el WebApplication
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/websitebuilder-.log",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}",
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 10_485_760, // 10MB
        rollOnFileSizeLimit: true,
        shared: true,
        flushToDiskInterval: TimeSpan.FromSeconds(1))
    .WriteTo.File(
        path: "logs/errors/error-.log",
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}",
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("🚀 Starting WebsiteBuilder API Application");
    
    // Configurar el AppContext para manejar fechas UTC con PostgreSQL
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);
    AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", false);
    
    var builder = WebApplication.CreateBuilder(args);

    // Usar Serilog en lugar del logger por defecto
    builder.Host.UseSerilog();

    // Add services to the container.

    // Configurar Npgsql DataSource con soporte para JSON dinámico
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Log.Information("Configuring PostgreSQL connection");
    
    var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
    dataSourceBuilder.EnableDynamicJson();
    var dataSource = dataSourceBuilder.Build();

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(dataSource));

    // Configurar JWT Authentication
    var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
    var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "WebsiteBuilderAPI";
    var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "WebsiteBuilderClient";

    Log.Information("Configuring JWT Authentication with Issuer: {Issuer}", jwtIssuer);

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
    Log.Information("Configuring CORS policy");
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowNextJsApp",
            builder =>
            {
                builder.WithOrigins(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:3001")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Register Services - Logging which services are being registered
    Log.Debug("Registering application services");
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ICompanyService, CompanyService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IRoleService, RoleService>();
    builder.Services.AddScoped<IPermissionService, PermissionService>();
    builder.Services.AddScoped<IUploadService, UploadService>();
    builder.Services.AddScoped<IShippingService, ShippingService>();
    builder.Services.AddScoped<ILocationService, LocationService>();
    builder.Services.AddScoped<INotificationSettingsService, NotificationSettingsService>();
    builder.Services.AddScoped<ICustomerService, CustomerService>();
    builder.Services.AddScoped<ICollectionService, CollectionService>();
    builder.Services.AddScoped<IProductService, ProductService>();
    builder.Services.AddScoped<INewsletterSubscriberService, NewsletterSubscriberService>();
    builder.Services.AddScoped<IPaginasService, PaginasService>();
    builder.Services.AddScoped<IPolicyService, PolicyService>();
    builder.Services.AddScoped<INavigationMenuService, NavigationMenuService>();
    builder.Services.AddScoped<RoomService>();
    builder.Services.AddScoped<IReservationService, ReservationService>();
    builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
    builder.Services.AddScoped<IOrderService, OrderService>();

    // Registrar repositorios
    builder.Services.AddScoped<PaymentProviderRepository>();

    // Registrar servicios de encriptación
    builder.Services.AddScoped<IEncryptionService, EncryptionService>();
    builder.Services.AddScoped<IPaymentProviderService, PaymentProviderService>();

    // Add HttpContextAccessor
    builder.Services.AddHttpContextAccessor();

    var app = builder.Build();

    // Agregar Serilog Request Logging Middleware
    app.UseSerilogRequestLogging(options =>
    {
        // Personalizar el mensaje de log
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        
        // Filtrar logs de health checks y archivos estáticos
        options.GetLevel = (httpContext, elapsed, ex) => 
        {
            if (ex != null || httpContext.Response.StatusCode >= 500)
                return LogEventLevel.Error;
            
            if (httpContext.Response.StatusCode >= 400)
                return LogEventLevel.Warning;
            
            if (httpContext.Request.Path.StartsWithSegments("/health"))
                return LogEventLevel.Verbose;
            
            return LogEventLevel.Information;
        };
        
        // Enriquecer con información adicional
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
            diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
            diagnosticContext.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString());
            
            if (httpContext.User?.Identity?.IsAuthenticated == true)
            {
                diagnosticContext.Set("UserName", httpContext.User.Identity.Name);
                diagnosticContext.Set("UserId", httpContext.User.FindFirst("userId")?.Value);
            }
        };
    });

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        Log.Information("Running in Development mode - Swagger enabled");
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        Log.Information("Running in Production mode");
    }

    // Middleware personalizado para capturar excepciones
    app.Use(async (context, next) =>
    {
        try
        {
            await next();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unhandled exception occurred while processing {RequestPath}", context.Request.Path);
            
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            
            var response = new
            {
                error = "Internal Server Error",
                message = app.Environment.IsDevelopment() ? ex.Message : "An error occurred processing your request",
                traceId = Activity.Current?.Id ?? context.TraceIdentifier
            };
            
            await context.Response.WriteAsJsonAsync(response);
        }
    });

    app.UseHttpsRedirection();

    // Servir archivos estáticos desde wwwroot
    app.UseStaticFiles();

    // Aplicar CORS
    app.UseCors("AllowNextJsApp");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Health check endpoint
    app.MapGet("/health", () => 
    {
        Log.Debug("Health check requested");
        return Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    });

    // Seed data
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            Log.Information("Initializing database");
            var context = services.GetRequiredService<ApplicationDbContext>();
            // SeedData.Initialize está comentado - el sistema ya tiene datos iniciales
            // await SeedData.Initialize(services);
            Log.Information("Database initialization completed successfully");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while initializing the database");
        }
    }

    Log.Information("🎯 WebsiteBuilder API started successfully on {Urls}", string.Join(", ", builder.WebHost.GetSetting("urls")?.Split(';') ?? ["http://localhost:5000"]));
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "💥 Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}