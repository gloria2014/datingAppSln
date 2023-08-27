
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;
using DatingApp_6.Helpers;
using DatingApp_6.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp_6.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        /* clase 174 creamos un método post y le paso el parametro de raiz "username" */
        [HttpPost("{username}")] 
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUserNameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (likedUser == null) return NotFound();
            /* cuando valida desde la aplicacion que el usuario que se logeó no se ael mismo */
            if (sourceUser.UserName == username) return BadRequest("You can not like yourself");
            /* cuando valida desde la api ejempplo "Swagger" ) */
            var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null) return BadRequest("You alredy like this user");

            /* aqui obtiene sus likes el usuario que se logeó y lo guarda */
            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };
            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("failed to like user");
        }

        /* clase 178 - modificamos este metodo, ahora se le pasa el object LikesParams 
         que a su vez hereda los atributos para la paginación. Y le enviamos en el response la paginación  */
        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId(); 
            var users = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize
                , users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}
