using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TaskAPI.Models;
using TaskAPI.Respository;
using TaskAPI.Utils;

namespace TaskAPI.Controllers
{
    public class UserController : ApiController
    {

        // GET: /api/User/GetStateAndCity
        /// <summary>
        /// Getting the State as well as its City in the Dictionary
        /// </summary>
        /// <returns>Null if Some Error Occured other wise dictionary of key as state and list of string</returns>
        [HttpGet]
        public IHttpActionResult GetStateAndCity()
        {
            try
            {
                Dictionary<string, List<string>> statecity = UserRepository.GetStateCities();

                if (statecity == null)
                {
                    return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No City or State Found" });
                }
                return Ok(statecity);
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // GET: /api/user/Interests
        /// <summary>
        /// Getting the List of interests with its id
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Interests()
        {
            try
            {
                List<Interests> interests = UserRepository.GetInterests();
                if (interests.Count == 0)
                {
                    return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No Interests are Present" });
                }
                return Ok(new { interests = interests });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // POST: /api/User/RegisterUser
        /// <summary>
        /// Adds the <paramref name="user"/> into the system by passing the required Properties.
        /// </summary>
        /// <param name="user">Model with Details</param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Register(User user)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Must pass the data in FormData" });
                }

                if (!Utilities.IfInputisArray(user.IdofInterests, out int[] idofinterests))
                {
                    ModelState.AddModelError("idofinterests", "IdofInterests Must be Provided in the form of array");
                }
                if (user.ProfileImage != null && !Utilities.IsFileExtensionValid(user.ProfileImage.FileName, ".png", ".jpeg", ".jpg"))
                {
                    ModelState.AddModelError("profileimage", "image must have the extensions as .png,.jpeg,.jpg");
                }


                if (ModelState.IsValid)
                {
                    user.InterestsId = idofinterests;
                    string profileimageurl = Utilities.SaveFile(user.ProfileImage.Buffer, HttpContext.Current.Request.MapPath("~/Content/Images"), user.ProfileImage.FileName);

                    if (user.DateOfBirth >= DateTime.Now)
                    {
                        return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Birthdate cannot be in the future" });
                    }
                    else if (user.Age <= 0)
                    {
                        return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Age Cannot be 0 or less than it." });
                    }
                    if (profileimageurl != null)
                    {
                        user.Profile = profileimageurl;
                        if (UserRepository.AddUpdateUser(user, "spAddUser"))
                        {
                            return Ok<Message>(new Message() { message = "User Registered Successfully" });
                        }
                        else
                        {
                            return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong while registering the User" });
                        }
                    }

                }
                return Content<Message>(HttpStatusCode.BadRequest, new Message() { message = "One or More Fields is Required", errors = ModelState.Values.SelectMany(e => e.Errors).Select(e => e.ErrorMessage) });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // GET: /api/User/Users/{id}
        /// <summary>
        /// Fetches the Single <see cref="User"/> by its id if not found returns No User Found.
        /// </summary>
        /// <param name="id">User id for fetching.</param>
        /// <returns>Single <see cref="User"/> Details</returns>
        [HttpGet]
        public IHttpActionResult Users(int id)
        {
            try
            {
                if (id == 0)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "User does not exist" });
                }
                User user = UserRepository.GetUsers(id).FirstOrDefault();
                if (user == null)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "No User Found" });
                }
                return Ok<User>(user);
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // GET: /api/User/Users
        /// <summary>
        /// Used to Fetch the List of the user
        /// </summary>
        /// <returns><see cref="List{User}"/> User </returns>
        [HttpGet]
        public IHttpActionResult Users()
        {
            try
            {
                List<User> users = UserRepository.GetUsers();
                users.ForEach(u =>
                {
                    u.Profile = Utilities.IsFilePresent(Path.Combine(HttpContext.Current.Request.MapPath("~/Content/Images"), u.Profile)) ? u.Profile : "profile.jpg";
                });
                return Ok(new { users = users, count = users.Count });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // DELETE: /api/user/Users/{id}
        /// <summary>
        /// Deletes the User for the passed <paramref name="id"/>
        /// </summary>
        /// <param name="id"> of the <see cref="User"/> to be Deleted</param>
        /// <returns></returns>
        [HttpDelete]
        [ActionName("Users")]
        public IHttpActionResult UserDelete(int id)
        {
            try
            {
                if (UserRepository.GetUsers(id).FirstOrDefault() != null && UserRepository.DeleteUser(id))
                {
                    return Ok<Message>(new Message() { message = "User Deleted Successfully" });
                }
                return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "No User Found" });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // PUT: /api/user/users/{id}
        /// <summary>
        /// Updates the User By passing the ID of the User and <see cref="User"/> Model
        /// </summary>
        /// <param name="id"> of the User want to Update</param>
        /// <param name="user"> Model by autobinding</param>
        /// <returns></returns>
        [ActionName("Users")]
        [HttpPut]
        public IHttpActionResult UpdateUser(int id, User user)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Must pass the data in FormData" });
                }

                User userupdater = UserRepository.GetUsers(id).FirstOrDefault();
                if (userupdater == null)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "No User Found" });
                }

                if (!Utilities.IfInputisArray(user.IdofInterests, out int[] idofinterests))
                {
                    ModelState.AddModelError("idofinterests", "IdofInterests Must be Provided in the form of array");
                }
                if (user.ProfileImage != null && !Utilities.IsFileExtensionValid(user.ProfileImage.FileName, ".png", ".jpeg", ".jpg"))
                {
                    ModelState.AddModelError("profileimage", "image must have the extensions as .png,.jpeg,.jpg");
                }

                user.Profile = string.IsNullOrWhiteSpace(userupdater.Profile) ? user.Profile : userupdater.Profile;
                // removing the modelstate error if the profile image is not null
                if (String.IsNullOrWhiteSpace(user.Profile) && user.ProfileImage == null)
                {
                    ModelState.AddModelError("profileimage", "Upload the Image");
                }
                // when the profile is not null then removing the Modelstate Error
                else if (!String.IsNullOrWhiteSpace(user.Profile) && user.ProfileImage == null)
                {
                    ModelState.Remove("user.profileimage");
                }


                if (ModelState.IsValid)
                {
                    user.Id = id;
                    user.InterestsId = idofinterests;

                    if (user.DateOfBirth >= DateTime.Now)
                    {
                        return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Birthdate cannot be in the future" });
                    }
                    else if (user.Age <= 0)
                    {
                        return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Age Cannot be 0 or less than it." });
                    }

                    if (user.ProfileImage != null)
                    {
                        Utilities.DeleteFile(Path.Combine(HttpContext.Current.Request.MapPath("~/Content/Images"), user.Profile));
                        user.Profile = Utilities.SaveFile(user.ProfileImage.Buffer, HttpContext.Current.Request.MapPath("~/Content/Images"), user.ProfileImage.FileName);
                    }

                    if (UserRepository.AddUpdateUser(user, "spUpdateUser"))
                    {
                        return Ok<Message>(new Message() { message = "User Updated Successfully" });
                    }

                    return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong while registering the User" });

                }
                return Content<Message>(HttpStatusCode.BadRequest, new Message() { message = "One or More Fields is Required", errors = ModelState.Values.SelectMany(e => e.Errors).Select(e => e.ErrorMessage) });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

    }
}
