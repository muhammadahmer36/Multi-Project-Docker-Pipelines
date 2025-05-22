using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class RecoverPasswordResponse
    {
        public ValidationResponse ValidationResponse { get; set; }
        public ContactInfo ContactInfo { get; set; }
    }
}