using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TaskAPI.Controllers
{
    public class HomeController : ApiController
    {
        // GET: /api/Test
        [HttpGet]
        public HttpResponseMessage Test()
        {
            return Request.CreateResponse<object>(HttpStatusCode.OK, new { message = "The Api is Working" });
        }
    }
}
