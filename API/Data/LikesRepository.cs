using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;
using DatingApp_6.Helpers;
using DatingApp_6.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_6.Data
{

    /*  clase 72 se crea esta clase y se implementa su interfáz ILikesRepository  */
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        /* clase 173 se implementa este metodo. Devuelve los datos del usuario que se logeó 
         * con la paginación de los cards de los miembros */
        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.TargetUser);
            }
            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUser =  users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KonwnAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUser,likesParams.PageNumber, likesParams.PageSize);


        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)  // agrega la entidad "LikedUsers" al resultado de la consulta
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}
