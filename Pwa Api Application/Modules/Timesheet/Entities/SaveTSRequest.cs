using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class SaveTSRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [Required]
        [JsonProperty("employeeNumber")]
        [StringLength(10)]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("periodIdentity")]
        public int PeriodIdentity { get; set; }

        [Required]
        [JsonProperty("listOfTsDates")]
        public string ListOfTsDates { get; set; }

        [Required]
        [JsonProperty("listOfTsDateWeekNums")]
        public string ListOfTsDateWeekNums { get; set; }

        [JsonProperty("id")]
        public int? Id { get; set; }

        [JsonProperty("dateTimeIn")]
        public DateTime? DateTimeIn { get; set; }

        [JsonProperty("dateTimeOut")]
        public DateTime? DateTimeOut { get; set; }

        [JsonProperty("hours")]
        public int? Hours { get; set; }

        [JsonProperty("minutes")]
        public int? Minutes { get; set; }

        [Required]
        [JsonProperty("listOfFieldIds")]
        public string ListOfFieldIds { get; set; }

        [Required]
        [JsonProperty("listOfFieldValues")]
        public string ListOfFieldValues { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}