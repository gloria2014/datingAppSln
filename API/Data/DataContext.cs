using DatingApp_6.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_6.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> Users { get; set; }
    }
}

