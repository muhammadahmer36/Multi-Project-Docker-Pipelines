namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class AuthenticationType
    {
        public int AuthenticationTypeId { get; set; }
        public string LoginName { get; set; }
        public string EmployeeNumber { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeEmail { get; set; }
    }
}