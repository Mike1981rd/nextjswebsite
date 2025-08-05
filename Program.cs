using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configurar Entity Framework con PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Usar CORS
app.UseCors("AllowNextJsApp");

app.UseAuthorization();

app.MapControllers();

// Aplicar migraciones automáticamente en desarrollo
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        try
        {
            dbContext.Database.Migrate();
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Error al aplicar migraciones");
        }
    }
}

app.Run();
