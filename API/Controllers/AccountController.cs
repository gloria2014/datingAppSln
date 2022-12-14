using AutoMapper;
using DatingApp_6.Data;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp_6.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(DataContext context, ITokenService tokenService
            , IMapper mapper)
        {
            _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Usuario existe");
            /* clase 150 aca ahora tenemos todas las propiedades del registroDto que se asiganran 
               * al objeto AppUser*/
            var usuario = _mapper.Map<AppUser>(registerDto);


            /* al usar la declaración del using significa que, cada vez que se utiliza un método de la clase HMACSHA512, 
             * se ejecutará el  método dispose(bool) que libera los recursos utlizados y los no utlizados por esta clase
             * Toda clase que implente  la interfaz IDispose libera los recursos de la clase que lo llama  depues de ejecutarse
             **/

            /* la clase HMACSHA512() proporciona el algoritmo para crear el hash */
            using var hmac = new HMACSHA512();
            try
            {
                /* clase 150 se comenta esta forma de envio y se cmabia por el envio con mapeo */
                //var user = new AppUser
                //{
                //    UserName = registerDto.Username.ToLower(),
                //    PaswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                //    PasswordSalt = hmac.Key,
                //};
              
                usuario.UserName = registerDto.Username.ToLower();
                usuario.PaswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
                usuario.PasswordSalt = hmac.Key;

                _context.Users.Add(usuario);
                await _context.SaveChangesAsync();

                return new UserDto
                {
                    Username = usuario.UserName,
                    Token = _tokenService.CreateToken(usuario),
                    KownAs = usuario.KnownAs,
                    Gender = usuario.Gender
                };
            }
            catch (Exception ex)
            {

                throw ex.InnerException;
            }
            
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        // desde Postman : https://localhost:7071/Account/Login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);
            
            if (user == null) return Unauthorized("nombre de usuario inválido");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PaswordHash[i])
                {
                    return Unauthorized("Password inválida");
                }
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KownAs  = user.KnownAs,
                Gender = user.Gender
            };

        }

       


          

            }   
}
