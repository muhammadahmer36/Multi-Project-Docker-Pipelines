using EcotimeMobileAPI.Libraries;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.Modules.Authentication.Services.Saml
{
    public class SamlService : ISamlService
    {
        public ISamlConfiguration _samlConfiguration { get; }
        public SamlService(ISamlConfiguration samlConfiguration)
        {
            _samlConfiguration = samlConfiguration;
        }

        public async Task<bool> IsValidTokenAsync(string token)
        {
            // Fetch IDP metadata
            using var httpClient = new HttpClient();
            var tokenResponse = await httpClient.GetStringAsync(_samlConfiguration.TokenEndPoint);
            // Deserialize IDP metadata
            var idpMetadata = JsonConvert.DeserializeObject<JsonWebKeySet>(tokenResponse);

            return !string.IsNullOrEmpty(token)
                 && idpMetadata.Keys.Any(k => k.Kid == Misc.GetHeaderValue(token, "kid"))
                 && string.Equals(Misc.GetClaimValue(token, "iss"), _samlConfiguration.Issuer)
                 && string.Equals(Misc.GetClaimValue(token, "aud"), _samlConfiguration.ClientId)
                 && string.Equals(Misc.GetClaimValue(token, "tid"), _samlConfiguration.TenantId);
        }
    }
}
