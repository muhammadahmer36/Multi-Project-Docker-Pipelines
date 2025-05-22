using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class TimeOffGetRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [JsonProperty("date")]
        public DateTime? Date { get; set; }

        [JsonProperty("managerMode")]
        public bool? ManagerMode { get; set; }

        [JsonProperty("listOfEmployeeNumbers")]
        public string ListOfEmployeeNumbers { get; set; }

        [JsonProperty("listOfReviewStatusCodes")]
        public string ListOfReviewStatusCodes { get; set; }

        [JsonProperty("groupId")]
        public string GroupId { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}