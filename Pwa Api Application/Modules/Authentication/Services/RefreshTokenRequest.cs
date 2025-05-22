using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public class RefreshTokenRequest
    {
        [Required]
        [JsonProperty("accessToken")]
        public string AccessToken { get; set; }

        [Required]
        [JsonProperty("refreshToken")]
        public string RefreshToken { get; set; }
    }
}