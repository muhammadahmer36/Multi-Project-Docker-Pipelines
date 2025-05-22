using EcotimeMobileAPI.Filters.Attributes;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class ConfirmRegistrationRequest
    {
        [Required]
        [StringLength(10)]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from employeeNumber")]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("confirmationCode")]
        [MaxLength(16, ErrorMessage = "Connot be greater than 6.")]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from confirmationCode")]
        public string ConfirmationCode { get; set; }
    }
}
