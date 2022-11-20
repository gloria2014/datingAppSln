using AutoMapper;
using DatingApp_6.Data;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;
using DatingApp_6.Helpers;
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
        private readonly IPhotoService _photoService;

        /* clase 94 en el contructor se remplaza la inyección del dataContext por IUserRepository */
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        //[AllowAnonymous]
        //public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        //{
        //    // return await _context.Users.ToListAsync();
        //    try
        //    {
        //        var usuario = await _userRepository.GetMembersAsnyc(); //GetUsersAsync();
        //       // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(usuario);
        //        return Ok(usuario);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}
        /*  clase 155 comemtamos el método de arriba "GetUsers()" porque se modfica */

        //public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers_original([FromQuery] UserParams parametros)
        //{ // en la clase 159 se agregga otras validaciones al me´todo GetUsers
        //    try
        //    {
        //        var lstPaginada = await _userRepository.GetMembersAsnyc(parametros);

        //        Response.AddPaginationHeader(lstPaginada.CurrentPage, lstPaginada.PageSize,
        //            lstPaginada.TotalCount, lstPaginada.TotalPages);

        //        return Ok(lstPaginada);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex.InnerException;
        //    }
        //}

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams parametros)
        {
            try
            {
                /* clase 159 se valida el género del usuario logeado */
                var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
                 parametros.CurrentUserName = usuario.UserName;
               
                if (string.IsNullOrEmpty(parametros.Gender))
                {
                    parametros.Gender = usuario.Gender == "male" ? "female" : "male";
                }

                var lstPaginada = await _userRepository.GetMembersAsnyc(parametros);
                Response.AddPaginationHeader(lstPaginada.CurrentPage, lstPaginada.PageSize,
                    lstPaginada.TotalCount, lstPaginada.TotalPages);

                return Ok(lstPaginada);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }



        //[Authorize] /* clase 131 agregamos otro parametro Name que será la ruta  */
        [HttpGet("{username}",Name = "GetUser")]
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
            /* clase 120 obtiene el token.  */
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            /* Clase 129 se simplifica la llamada al método 
         * "var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;" */
           // var username = User.GetUsername();

            var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            // mapea dto a obj
            _mapper.Map(memberUpdateDto, usuario);

            _userRepository.Update(usuario);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            
            return BadRequest();
        }

        /* clase 165 aca hago un stop para crear el metodo que recupera clave */
        [HttpPut("recuperaClave")]
        public async Task<ActionResult> RecuperaClave(MemberUpdateDto memberUpdateDto)
        {
            var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            _mapper.Map(memberUpdateDto, usuario);

            _userRepository.Update(usuario);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest();
        }

        /* clase 129 se crea método para cargar foto */
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto (IFormFile file)
        {
            var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (usuario.Photos.Count == 0) {
                photo.IsMain = true;
            }

            usuario.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDto>(photo);

                //* clase 131 se comenta : return _mapper.Map<PhotoDto>(photo) y creamos otro donde recibe otro parametro         
                //return donde le pasamos el nombre de la ruta y el objeto mapeado */
                return CreatedAtRoute("GetUser",new {username = usuario.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("problem adding photo");
        }

        /* clase 135 se crea metodo para setear una foto como main de la lista de fotos  */
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            /* clase 135  obtiene al usario por el nombre de ususario obtenido en el token. Es asíncrono poruqe va a la bd */
            var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            /* aca obtiene la foto y esto no es asincrónico poruqe el usuario ya está en la memoria */
            var foto = usuario.Photos.FirstOrDefault(x => x.Id == photoId);       
            /* aca nos aseguramos que el usuario no establesca otra vez la foto como principal (porque ya es la principal) */
            if (foto.IsMain) return BadRequest("this is already your main photo");

            /* aca obtengo la foto seteada como main desde la bd (osea isMain=true) */
            var currentMain = usuario.Photos.FirstOrDefault(x => x.IsMain);
          
            /* si la foto actual es la principal? entonces la seteo isMAin = false y la  foto que obtuve desde la bd la seteo como true para que esta sea la principal */
            if(currentMain != null) currentMain.IsMain = false;
            foto.IsMain = true;

            /*ya aca solo guarda los cambios realizados previamente en la bd */
            if(await _userRepository.SaveAllAsync()) return NoContent(); // devuelve 204 = devuelve vacio pero bien

            return BadRequest("Failed to set main photo");
        }


        /*  clase 138 se agrega método  DeletePhoto de tarea asyncrono
         *  y se le envia la ruta "delete-photo/{photoId}" */
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            // 1. se obtiene el objeto usuario desde la bd como tarea async.
            var usuario = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
        
            // 2. obtengo la foto desde el objeto usuario (hasta altura el objeto esnta en memoria)
            var foto = usuario.Photos.FirstOrDefault(x => x.Id == photoId);

            // 3. si no hay foto retorna not found
            if (foto == null) return NotFound();

            // 3. si la foto esta como pricipal no se puede eliminar
            if (foto.IsMain) return BadRequest("You cannot delete your main photo");

            if (foto.PublicId != null)
            {
                // 4. si viene foto, entonces Delete file from Cloudinary asynchronously.
                var result = await _photoService.DeletePhotoAsync(foto.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            // 5. eliminamos el objeto foto de la colecion Icollection
            usuario.Photos.Remove(foto);

            // 6. actualizamos  la bd ( en este caso se actualiza con la eliminación de la foto
            if (await _userRepository.SaveAllAsync()) return Ok();

            // 7. si no se pudo eliminar la foto
            return BadRequest("Failed to delete the photo");
        }
    }
}
