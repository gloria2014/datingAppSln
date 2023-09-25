using DatingApp_6.Data;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;
using DatingApp_6.Middleware;
using DatingApp_6.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddIdentityServices(builder.Configuration);



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(x => x.AllowAnyHeader()
.AllowAnyMethod()
.AllowCredentials()
.WithOrigins("https://localhost:4200"));


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence"); /* endpoint para el hub*/
app.MapHub<MessageHub>("hubs/message");

using var scope = app.Services.CreateScope();

var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();

    var userManager = services.GetRequiredService<UserManager<AppUser>>();/* class 207 se agrega esra linea*/
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();

    await context.Database.MigrateAsync();

    // context.Connections.RemoveRange(context.Connections);
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");

    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

//app.Run();
await app.RunAsync();
