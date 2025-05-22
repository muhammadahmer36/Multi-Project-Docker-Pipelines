using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using EcotimeMobileAPI.Filters.Attributes;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class ForgetPasswordRequest
    {
        [Required(ErrorMessage = "LoginName is required.")]
        [JsonProperty("loginName")]
        [MinLenght(2, ErrorMessage = "LoginName should be at least two characters long.")]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from loginName")]
        public string LoginName { get; set; }
        public bool IsAccountActivation { get; set; }
    }
}