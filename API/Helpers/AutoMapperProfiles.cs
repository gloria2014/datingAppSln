using AutoMapper;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;

namespace DatingApp_6.Helpers
{
    /*
     esta clase se encarga de mapear de un objeto a otro.
     */
    public class AutoMapperProfiles: Profile /* profile es una libreria de automapper */
    {
        public AutoMapperProfiles()
        {
            /*
             clase 98 se agrega un método para obtener la url de la foto y agregarla al
            usuario
             */
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
                ;
            CreateMap<Photo, PhotoDto>();

            /* clase 120 se mapea de updateDto a UserApp */
            CreateMap<MemberUpdateDto, AppUser>();

            /* clase 150 se mapea de registroDto a Apuser*/
            CreateMap<RegisterDto, AppUser>();

            /* class 183 - el automapper es una herramienta que permite pasar informacion de un objetoa otro
             * en este caso, el método CreateMap<origen, destino>() donde ForMemeber es un método
             * de auto mapper y mediante expresion lambda donde, el primer parametro es el destino y el segundo es el origen
             *   - el método MapFrom() indica de donde viene la solicitud, ese valor irá al destino  */
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl,
                opt => opt.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl,
                opt => opt.MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}
