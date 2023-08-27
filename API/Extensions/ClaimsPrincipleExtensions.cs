using System.Security.Claims;

namespace DatingApp_6.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            //return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // clase 165 se cambia el claim, envez de usar el "NameIdentifier" se usará el "Name"
            // del claimTyoes (tipos de reclamo) para el nombre de usuario que representa el nombre
            // único que se establerá en el token
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        /* clase 165 se agrega el método de extension ... que devolverá el identificador del nombre */
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }

       
    }   
    
}
