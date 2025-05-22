using System.Threading.Tasks;

namespace EcotimeMobileAPI.Modules.Authentication.Services.Saml
{
    public interface ISamlService
    {
        Task<bool> IsValidTokenAsync(string token);
    }
}
