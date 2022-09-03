

using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp_6.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id  { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        /// <summary>
        /// se agrega la entidad del usuario y su id porque la relacion es de uno a mas
        /// </summary>
        public AppUser AppUserObj { get; set; }
        public int AppUserObjId { get; set; }


    }
}