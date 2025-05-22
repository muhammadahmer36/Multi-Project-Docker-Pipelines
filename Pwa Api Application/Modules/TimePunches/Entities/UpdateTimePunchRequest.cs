using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using EcotimeMobileAPI.Filters.Attributes;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class UpdateTimePunchRequest
    {
        [Required]
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("fieldIds")]
        public string FieldIds { get; set; }

        [JsonProperty("fieldValues")]
        public string FieldValues { get; set; }

        [JsonProperty("separator")]
        [StringLength(1)]
        public string Separator { get; set; }

        [NotEmpty(ErrorMessage = "GUID assigned to a punch must be not empty.")]
        public string ClientGuidId { get; set; }
    }
}