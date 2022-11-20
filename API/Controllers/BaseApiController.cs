using DatingApp_6.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp_6.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("[controller]")]
    public class BaseApiController: ControllerBase
    {
    

    }
}
