﻿using DatingApp_6.Data;
using DatingApp_6.Helpers;
using DatingApp_6.Interfaces;
using DatingApp_6.Services;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_6.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<LogUserActivity>();
            
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(options =>
           {
               var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");


               string connStr;
               // Depending on if in development or production, use either Heroku-provided
               // connection string, or development connection string from env var.
               if (env == "Development")
               {
                   // Use connection string from file.
                   connStr = config.GetConnectionString("DefaultConnection");
               }
               else
               {
                   // Use connection string provided at runtime by Heroku.
                   var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                   // Parse connection URL to connection string for Npgsql
                   connUrl = connUrl.Replace("postgres://", string.Empty);
                   var pgUserPass = connUrl.Split("@")[0];
                   var pgHostPortDb = connUrl.Split("@")[1];
                   var pgHostPort = pgHostPortDb.Split("/")[0];
                   var pgDb = pgHostPortDb.Split("/")[1];
                   var pgUser = pgUserPass.Split(":")[0];
                   var pgPass = pgUserPass.Split(":")[1];
                   var pgHost = pgHostPort.Split(":")[0];
                   var pgPort = pgHostPort.Split(":")[1];

                   connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; SSL Mode=Require; Trust Server Certificate=true";
               }

               // Whether the connection string came from the local development configuration file
               // or from the environment variable from Heroku, use it to set up your DbContext.
               options.UseSqlServer(connStr);
           });
            return services;
        }
    }
}
