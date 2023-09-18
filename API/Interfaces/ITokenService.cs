using DatingApp_6.Entities;

namespace DatingApp_6.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
