using MultipartDataMediaFormatter.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace TaskAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [RegularExpression("^[a-z][a-zA-Z0-9._]+\\@[a-z]+\\.[a-z]{2,3}", ErrorMessage = "Enter Correct Email Id")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be greater than 8 Characters")]
        [RegularExpression("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$", ErrorMessage = "Password Must Contain one Lowercase, one Uppercase, one Number, one Symbol")]
        public string Password { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public int Age { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "The city name must not contain any numbers or special characters.")]
        public string City { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [DisplayName("Phone Number")]
        [RegularExpression("^(\\d\\s*){10}$", ErrorMessage = "Phone Number must be a number and should contains 10 digits only.")]
        public string PhoneNo { get; set; }


        public string Profile { get; set; }

        public List<Interests> Interests { get; set; } = new List<Interests>();

        [Required]
        public string IdofInterests { get; set; }

        public int[] InterestsId { get; set; }

        public List<int> ListofInterestId
        {
            get
            {
                return Interests.Select(e => e.InterestId).ToList();
            }
        }

        [Required]
        public HttpFile ProfileImage { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public DateTime DeletedOn { get; set; }
    }
}