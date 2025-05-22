using Newtonsoft.Json;
using EcotimeMobileAPI.Filters.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class SamlRegistrationRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from employeeNumber")]
        public string EmployeeNumber { get; set; }

        [Required(ErrorMessage = "LoginName is required.")]
        [JsonProperty("loginName")]
        [MinLenght(2, ErrorMessage = "LoginName should be at least two characters long.")]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from loginname")]
        public string LoginName { get; set; }

        [Required]
        [JsonProperty("emailAddress")]
        [StringLength(250)]
        [DataType(DataType.EmailAddress)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Invalid Email Address")]
        public string EmailAddress { get; set; }

        [JsonProperty("mobileNumber")]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Entered phone format is not valid.")]
        public string MobileNumber { get; set; }

        internal string Password { get => "Hbs123"; }
    }
}
