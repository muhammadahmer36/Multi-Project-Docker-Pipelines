using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class DeleteTSEntriesRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [Required]
        [JsonProperty("tsDate")]
        public DateTime TsDate { get; set; }

        [JsonProperty("listOfEntryIds")]
        public string ListOfEntryIds { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}