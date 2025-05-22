using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class DeleteByWeeksRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [JsonProperty("listOfWeekNum")]
        public string ListOfWeekNum { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}