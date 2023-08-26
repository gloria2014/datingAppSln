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
        public DbSet<UserLike> Likes { get; set; }
        public DbSet <Message> Messages { get; set; }

        /* class 171 Se crea el método OnModelCreating, este constructor lo que hace es eliminar 
         * lo que esta en la migrations y manda este
         * a la tabla UserLike le seteamos como primary key  a SourceUserId y TargerUserId 
        Configuramos la entidad UserLike de tal forma que vaya de uno a muchos
            * con los objetos SourceUser y TargetUser UNa vez terminado se migra la entidad:
            * desde la consola > dotnet ef migrations add LikeEntityAddedd y debiera creare otro archivo en la carpeta de migrations
            * luego agregar la entidad a la bd asi: 
          C:\Users\Gloria\Desktop\Udemy\local_DatingApp\API>dotnet ef database update 20221125211448_LikeEnityAdded
        IMP: si la migracion se crea con tablas ya exsitentes, hay que elimnarlas y solo dejar la entidad que se queire agregar. 
         */
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserLike>()
                .HasKey(k => new {k.SourceUserId, k.TargetUserId});
           
            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.NoAction); // .Cascade

            builder.Entity<UserLike>()
                .HasOne(t => t.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(t => t.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction); // NoAction

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}

