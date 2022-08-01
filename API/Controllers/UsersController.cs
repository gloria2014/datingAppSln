using DatingApp_6.Data;
using DatingApp_6.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using System.Data.Entity;

namespace DatingApp_6.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
            
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser> >GetUsers(int id)
        {
          

            try
            {
                return await _context.Users.FindAsync(id);
            }
            catch (Exception ex)
            {

                // throw ex.Message;
                throw ex.InnerException;
            }

            return null;
        }
    }
}
