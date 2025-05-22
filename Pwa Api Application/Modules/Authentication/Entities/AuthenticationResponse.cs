using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class AuthenticationResponse
    {
        public PasswordInfoItem PasswordInfo { get; set; }
        public DashboardResponse DashboardResponse { get; set; }
        public ValidationResponse ValidationResponse { get; set; }
        public AuthenticationType AuthenticationType { get; set; }
    }
}