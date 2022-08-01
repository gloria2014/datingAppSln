using DatingApp_6.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddCors();
builder.Services.AddControllers();


//--------- ejemplo udemy ------------
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options => {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])),
//            ValidateIssuer = false,
//            ValidateAudience = false,
//        };
//    });
//----------------------------ejemplo de google https://dev.to/isaacojeda/aspnet-core-6-autenticacion-jwt-y-identity-core-170i -------------
//builder.Services
//    //.AddHttpContextAccessor()
//    //.AddAuthorization()
//    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = false,
//            ValidateAudience = false,
//            //ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            //ValidIssuer = builder.Configuration["Jwt:Issuer"],
//            //ValidAudience = builder.Configuration["Jwt:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"]))
//        };
//    });
//builder.Services.AddAuthentication(opt =>
//{
//    opt.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  
//})
//        .AddJwtBearer("Bearer", options =>
//        {
//            options.Authority = "https://localhost:4200"; // "https://localhost:XXXX";
//            options.Audience = "idwebclient";
//            options.TokenValidationParameters.ValidateAudience = false;
//            options.RequireHttpsMetadata = true;
//            options.TokenValidationParameters.IssuerSigningKey =
//                new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TokenKey"));
//        });
//------------------------------------------

//builder.Services.AddScoped<ITokenService, TokenService>();

//builder.Services
//    .AddDbContext<DataContext>(options => options.UseSqlServer(
//    builder.Configuration.GetConnectionString("DefaultConection")
//    ));
//--------------------------------------------
//builder.Services
//    .AddSqlite<MyDbContext>(builder.Configuration.GetConnectionString("Default"))
//    .AddIdentityCore<User>()
//    .AddRoles<IdentityRole>()
//    .AddEntityFrameworkStores<MyDbContext>();
//--------------------------------------------


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

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
