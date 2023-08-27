using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Helpers;

namespace DatingApp_6.Interfaces
{
    /* clase 171 se crea esta clase  */
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}
