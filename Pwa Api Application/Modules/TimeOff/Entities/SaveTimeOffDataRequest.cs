using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class SaveTimeOffDataRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [JsonProperty("requestId")]
        public int? RequestId { get; set; }

        [Required]
        [JsonProperty("listOfDates")]
        public string ListOfDates { get; set; }

        [Required]
        [JsonProperty("listOfPayCodeIds")]
        public string ListOfPayCodeIds { get; set; }

        [Required]
        [JsonProperty("listOfDurations")]
        public string ListOfDurations { get; set; }

        [JsonProperty("headerStartDate")]
        public DateTime? HeaderStartDate { get; set; }

        [JsonProperty("headerEndDate")]
        public DateTime? HeaderEndDate { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
        public bool IsEdit { get; set; }
    }
}