using AutoMapper;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;

namespace DatingApp_6.Helpers
{
    /*
     esta clase se encarga de mapear de un objeto a otro.
     */
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            /*
             clase 98 se agrega un método para obtener la url de la foto y agregarla al ususrio
             */
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
                ;
            CreateMap<Photo, PhotoDto>();
            /* clase 120 se mapea el updateDto a UserApp */
            CreateMap<MemberUpdateDto, AppUser>();

        }
    }
}
