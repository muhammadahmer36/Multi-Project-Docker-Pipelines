using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using EcotimeMobileAPI.Filters.Attributes;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class ValidUserRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        [MustNotHaveSpaces(ErrorMessage = "Please remove spaces from employeeNumber")]
        public string EmployeeNumber { get; set; }
    }
}