using Newtonsoft.Json;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    [JsonObject("tokenManagement")]
    public class TokenManagement
    {
        [JsonProperty("secret")]
        public string Secret { get; set; }

        [JsonProperty("issuer")]
        public string Issuer { get; set; }

        [JsonProperty("audience")]
        public string Audience { get; set; }

        [JsonProperty("accessExpiration")]
        public int AccessExpiration { get; set; }

        [JsonProperty("refreshTokenExpiration")]
        public int RefreshTokenExpiration { get; set; }
    }
}