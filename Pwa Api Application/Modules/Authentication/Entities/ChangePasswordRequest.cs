using EcotimeMobileAPI.Filters.Attributes;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public class ChangePasswordRequest
    {
        [JsonProperty("loginName")]
        [Required(ErrorMessage = "LoginName is required.")]
        [MinLenght(2, ErrorMessage = "LoginName should be at least two characters long.")]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from loginname")]
        public string LoginName { get; set; }

        [JsonProperty("oldPassword")]
        [Required(ErrorMessage = "OldPassword is required.")]
        
        public string OldPassword { get; set; }

        [Required]
        [JsonProperty("deviceId")]
        [StringLength(1000)]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from deviceId")]
        public string DeviceID { get; set; }

        [JsonProperty("deviceName")]
        [Required]
        [StringLength(1000)]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from deviceName")]
        public string DeviceName { get; set; }

        public string DomainName { get; set; }

        [JsonProperty("password")]
        [Required(ErrorMessage = "password is required.")]
        public string Password { get; set; }

        [Required]
        [JsonProperty("confirmPassword")]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

    }
}