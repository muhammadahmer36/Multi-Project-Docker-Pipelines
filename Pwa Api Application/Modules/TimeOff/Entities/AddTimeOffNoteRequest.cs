using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class AddTimeOffNoteRequest
    {
        [Required]
        [JsonProperty("requestId")]
        public int RequestId { get; set; }

        [Required]
        [JsonProperty("note")]
     
        public string Note { get; set; }
    }
}