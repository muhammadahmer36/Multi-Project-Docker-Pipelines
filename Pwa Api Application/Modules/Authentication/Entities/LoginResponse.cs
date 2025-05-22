using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class LoginResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }
        public AuthenticationType EmployeeDetail { get; set; }
        public DashboardResponse Dashboard { get; set; }
    }
}