using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class EmployeeValidationResponse
    {
        public AuthenticationType AuthenticationType { get; set; }
        public PasswordValidation PasswordValidation { get; set; }
    }
}
