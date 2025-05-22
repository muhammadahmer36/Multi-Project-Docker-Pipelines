using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class ExecuteActionRequest
    {
        [Required]
        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [Required]
        [JsonProperty("actionId")]
        public int ActionId { get; set; }

        [Required]
        [JsonProperty("requestedRequestIds")]
        public string RequestedRequestIds { get; set; }

        [JsonProperty("managerMode")]
        public bool? ManagerMode { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }
    }
}