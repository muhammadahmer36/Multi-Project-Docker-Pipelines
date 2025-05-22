namespace EcotimeMobileAPI.Modules.Authentication.Services.Saml
{

    public interface ISamlConfiguration
    {
        string Secret { get; }
        string Issuer { get; }
        string ClientId { get; }
        string TenantId { get; }
        string TokenEndPoint { get; }
    }
}
