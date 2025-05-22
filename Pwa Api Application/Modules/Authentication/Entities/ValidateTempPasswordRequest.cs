using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class ValidateTempPasswordRequest
    {
        [Required]
        [JsonProperty("username")]
        public string Username { get; set; }

        [Required]
        [JsonProperty("tempPassword")]
        [DataType(DataType.Text)]
        //[StringLength(3, MinimumLength = 1, ErrorMessage = "TempPassword must be between 1 - 3 characters")]
        public string TempPassword { get; set; }
    }
}