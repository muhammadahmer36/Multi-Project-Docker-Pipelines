using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class EmployeeValidationItem: EmployeeValidationResponse
    {
        public ValidationResponse ValidationResponse { get; set; }

        public EmployeeAccountItem EmployeeAccount { get; set; }
    }
}