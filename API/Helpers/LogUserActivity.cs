using DatingApp_6.Extensions;
using DatingApp_6.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp_6.Helpers
{
    /* clase 164 se crea la clase LogUserActivity */
    public class LogUserActivity : IAsyncActionFilter
    {
        /* clase 165 este método recibe el token o claim ????? */
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            /* vamos atener acceso al contexto despues de que se ejecute (next -> devuelve el contexto de la accion ejecutada)  */
           var resultContext = await next();

            // si el usuario envió un token y esta autenticado, entonces será true
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            /* clase 165 se cambia el mtodo GetUserName() porGetUserId() en vez de get el ususario por 
             * su nombre lo haremos por su id  */
            //var username = resultContext.HttpContext.User.GetUsername();
            var userId = resultContext.HttpContext.User.GetUserId();

            // para tener acceso al repositorio, mediante la llamada ala interfaz IUserRepository
            var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            var usuarioObj = await repo.GetUserByIdAsync(userId);
            usuarioObj.LastActive = DateTime.Now;
            await repo.SaveAllAsync();
        }
    }
}
