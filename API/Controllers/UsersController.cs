using AutoMapper;
using DatingApp_6.Data;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
//using System.Data.Entity;

namespace DatingApp_6.Controllers
{
    /*
     clase 91 , se comenta los atributos de autorize y allowanonymous para agregar el atrinbuto authorize a nivel
     de clase, esto significa que todos los métodos dej esta clase estan protegidos con autorización
        */
    [Authorize]
    public class UsersController  : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        /* clase 94 en el contructor se remplaza la inyección del dataContext por IUserRepository */
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // return await _context.Users.ToListAsync();

            try
            {
                var usuario = await _userRepository.GetMembersAsnyc(); //GetUsersAsync();
               // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(usuario);

                return Ok(usuario);
            }
            catch (Exception ex)
            {

                throw ex.InnerException;
            }

        }

        //[Authorize]
        [HttpGet("{username}")]
        //public async Task<ActionResult<MemberDto>> GetUserByUserNameAsync(string username)
        //{
        //   var user = await _userRepository.GetUserByUserNameAsync(username);
        //    return _mapper.Map<MemberDto>(user);
        //}
        public async Task<ActionResult<MemberDto>> GetUser (string username)
        {
            return await _userRepository.GetMemberAsnyc(username);
        }

        /* clase 120 crea el método UpdateUser() */
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            /* clase 120 obtiene el token */
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // obtiene el objeto usuario
            var usuario = await _userRepository.GetUserByUserNameAsync(username);
            // mapea dto a obj
            _mapper.Map(memberUpdateDto, usuario);

            _userRepository.Update(usuario);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            
            return BadRequest();
        }
    }
}
