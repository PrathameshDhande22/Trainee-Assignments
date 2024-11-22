using MultipartDataMediaFormatter;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace TaskAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // Removing the XML Formatter from the api
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.Add(new FormMultipartEncodedMediaTypeFormatter());

            // Adding the cors to the api to serve the request
            // TODO: Apply your localhost path only
            EnableCorsAttribute cors = new EnableCorsAttribute(ConfigurationManager.AppSettings["alloworigin"].ToString(), "*", "*");
            config.EnableCors(cors);

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
