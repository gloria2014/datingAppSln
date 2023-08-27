using System.ComponentModel.DataAnnotations;

namespace DatingApp_6.DTOs
{
    public class RecuperaClaveDto
    {
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
