namespace EcotimeMobileAPI.Modules.Authentication.Services.Saml
{
    public class SamlConfiguration : ISamlConfiguration
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string TenantId { get; set; }
        public string TokenEndPoint { get; set; }

    }
}
