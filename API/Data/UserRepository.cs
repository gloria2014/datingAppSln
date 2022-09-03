using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_6.Data
{
    public class UserRepository : IUserRepository
    {

        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }
        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            try
            {
                var resp = await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
                return resp;
            }
            catch (Exception ex)
            {

                throw ex.InnerException;
            }
            
        }
        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        /* clase 99 */
        public async Task<MemberDto> GetMemberAsnyc( string username)
        {
            //return await _context.Users
            //    .Where(x => x.UserName == username)
            //    .Select(user => new MemberDto
            //    {
            //        Id = user.Id,
            //        UserName = user.UserName
            //    }).SingleOrDefaultAsync();
            /*
             leccion 99 ahora se cambia el select porque  trae todas las propiedades y eso no es optimo
            ( ejemplo viiena la clave y eso no debiera venir) y lo cambiaremos por ProjectTo<>
             */
            return await _context.Users
              .Where(x => x.UserName == username)
              .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
              .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsnyc()
        {
            return await _context.Users
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
