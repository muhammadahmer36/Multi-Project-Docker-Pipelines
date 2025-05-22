using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TimesheetSearchResultRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [JsonProperty("periodIdentity")]
        public int? PeriodIdentity { get; set; }

        [JsonProperty("listOfEmployeeNumbers")]
        public string ListOfEmployeeNumbers { get; set; }

        [JsonProperty("listOfStatusCodes")]
        public string ListOfStatusCodes { get; set; }

        [JsonProperty("statusCodesCondition")]
        public string StatusCodesCondition { get; set; }

        [JsonProperty("groupId")]
        public string GroupId { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}