namespace DatingApp_6.Helpers
{
   

    /* clase 155 se crea esta clase y se setea sus propiedades */
    public class UserParams:PaginationParams
    {

        /*  clase 159 se agrega 2 propiedades */
        public string? CurrentUserName { get; set; }
        public string? Gender { get; set; }
        /*  clase 160 se agrega 2 propiedades para filtro edad */
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 150;

        /*  calse 163 se agrega nueva propiedad OrderBy */
        public string OrderBy { get; set; } = "lastActive";

    }
}
