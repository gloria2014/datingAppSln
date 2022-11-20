using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Helpers;
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

        /* clase 155 se comenta el método  porque se modifica y se crea otro con el mismo nombre */
        //public async Task<IEnumerable<MemberDto>> GetMembersAsnyc()
        //{ 
        //    return await _context.Users
        //        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        //        .ToListAsync();
        //}

        public async Task<PagedList<MemberDto>> GetMembersAsnyc_original(UserParams userParam)
        {// en la clase 159 se agrega otras validaciones 
            var query = _context.Users
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(query,
                userParam.PageNumber, userParam.PageSize);
        }

        /* clase 159 se modifica el metodo de la clase 155 GetMembersAsnyc-original   */
        public async Task<PagedList<MemberDto>> GetMembersAsnyc(UserParams userParam)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(q => q.UserName != userParam.CurrentUserName);
            query = query.Where(q => q.Gender == userParam.Gender);

            var minDob = DateTime.Today.AddYears(-userParam.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParam.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            /* clase 163  se agrega nueva consulta OrderByDescending */
            query = userParam.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(
                _mapper.ConfigurationProvider).AsNoTracking(),
                userParam.PageNumber,
                userParam.PageSize
                );
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
