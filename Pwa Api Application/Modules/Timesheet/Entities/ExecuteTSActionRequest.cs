using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class ExecuteTSActionRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [Required]
        [JsonProperty("actionId")]
        public int ActionId { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [JsonProperty("listOfEmployeeNumbers")]
        public string ListOfEmployeeNumbers { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}