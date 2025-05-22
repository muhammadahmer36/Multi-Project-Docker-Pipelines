using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using EcotimeMobileAPI.Filters.Attributes;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class NewTimePunchRequest
    {
        [Required]
        [JsonProperty("functionId")]
        public int FunctionId { get; set; }

        [Required]
        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

        [Required]
        [JsonProperty("timeZoneOffset")]
        public decimal TimeZoneOffset { get; set; }

        [Required]
        [JsonProperty("geoLocation")]
        [StringLength(250)]
        public string GeoLocation { get; set; }

        [JsonProperty("UtcTimestamp")]
        public DateTime UtcTimestamp { get; set; }
        public bool IsOfflinePunch { get; set; }
        [NotEmpty(ErrorMessage = "GUID assigned to a punch must be not empty.")]
        public string ClientGuidId { get; set; }

        [Required]
        [JsonProperty("source")]
        public string Source { get; set; }
    }
}