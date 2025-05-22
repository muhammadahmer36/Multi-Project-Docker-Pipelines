namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class EmployeeAccountItem
    {
        public int AuthenticationTypeId { get; set; }
        public int AccountId { get; set; }
        public string LoginName { get; set; }
        public string EmployeeNumber { get; set; }
        public string EmployeeEmail { get; set; }
    }
}
