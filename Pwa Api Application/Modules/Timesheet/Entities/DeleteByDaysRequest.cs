using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class DeleteByDaysRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [JsonProperty("listOfDays")]
        public string ListOfDays { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}