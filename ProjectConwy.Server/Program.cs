using Azure.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectConwy.Server.Data;
using ProjectConwy.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var keyVaultName = builder.Configuration["KeyVaultName"]; // Store this in appsettings.json or as an env variable
if (!string.IsNullOrEmpty(keyVaultName))
{
    var keyVaultUri = $"https://{keyVaultName}.vault.azure.net/";
    builder.Configuration.AddAzureKeyVault(
        new Uri(keyVaultUri),
        new DefaultAzureCredential()
    );
}


Console.WriteLine("ConnectionString: " + builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton(new CityPlaceLoader("Resources/city_places_2024.csv"));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
