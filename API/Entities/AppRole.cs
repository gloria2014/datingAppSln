using Microsoft.AspNetCore.Identity;

namespace DatingApp_6.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
