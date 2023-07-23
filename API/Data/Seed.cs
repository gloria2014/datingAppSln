using DatingApp_6.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace DatingApp_6.Data
{
    /* Clase 88 - se crea esta clase  */
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            // 1. validar si la tabla user tiene registros sale; sino innserta registros
            if (await context.Users.AnyAsync()) return;

            // 2. lee el archivo .json
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");

            // 3. deserializa la data
            //var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);

            // 4. agrego la data a la entidad
            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PaswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("pa$$w0rd"));
                user.PasswordSalt = hmac.Key;
                context.Users.Add(user);
            }
            await context.SaveChangesAsync();
        }
    }
}
