using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using EcotimeMobileAPI.Filters.Attributes;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class UpdatePasswordRequest : ForgetPasswordRequest
    {

        [JsonProperty("password")]
        [Required]  
        public string Password { get; set; }

        [Required]
        [JsonProperty("confirmPassword")]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        [Required]
        [JsonProperty("tempPassword")]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from TempPassword")]
        public string TempPassword { get; set; }
    }
}