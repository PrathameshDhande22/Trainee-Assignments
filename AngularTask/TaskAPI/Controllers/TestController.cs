using MultipartDataMediaFormatter.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;



namespace TaskAPI.Controllers
{

    public class Uploader
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public HttpFile image { get; set; }
    }

    public class JSONBody
    {
        public int id { get; set; }

        public string content { get; set; }
    }

    public class TestController : ApiController
    {

        [HttpPost]
        public IHttpActionResult UploadImage()
        {
            Trace.WriteLine("Uploaded the image");
            if (Request.Content.IsMimeMultipartContent())
            {
                return Ok(new { message = "yes it is" });
            }

            return Ok(new { message = "Uploaded the Image" });

        }

        [HttpPost]
        public IHttpActionResult UploaderTrial(Uploader uploader)
        {
            // Saving the Buffer File
            if (ModelState.IsValid && Request.Content.IsMimeMultipartContent())
            {

                File.WriteAllBytes(HttpContext.Current.Server.MapPath("~/Content") + "/" + uploader.image.FileName, uploader.image.Buffer);
                return Ok(new { message = "The Uploaded DAta", data = uploader, image = uploader.image.FileName });
            }
            return Content(System.Net.HttpStatusCode.NotAcceptable, ModelState.Values.Select(e => e.Errors).Select(e => e.Select(e1 => e1.ErrorMessage)));
        }

        [HttpPost]
        public IHttpActionResult GetJsonFile(JSONBody json)
        {
            return Ok(json);
        }
    }
}
