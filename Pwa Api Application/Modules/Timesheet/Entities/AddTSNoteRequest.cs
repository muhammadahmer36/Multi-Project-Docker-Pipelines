using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class AddTSNoteRequest
    {
        [Required]
        [JsonProperty("note")]
       
        public string Note { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        public string EmployeeNumber { get; set; }
    }
}