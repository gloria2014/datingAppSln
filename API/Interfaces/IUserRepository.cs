using DatingApp_6.DTOs;
using DatingApp_6.Entities;

namespace DatingApp_6.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUserNameAsync(string username);

        /* clase 99 se agrega nuevos métodos para automatizar. devolver propiedades de mienmbro
         * y no usuers */
        Task<IEnumerable<MemberDto>> GetMembersAsnyc();
        Task<MemberDto> GetMemberAsnyc(string username);
    }
}
