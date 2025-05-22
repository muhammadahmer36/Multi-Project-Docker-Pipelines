using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class RecoverPasswordRequest
    {
        [Required]
        [JsonProperty("employeeNumber")]
        public string EmployeeNumber { get; set; }

        [Required]
        [JsonProperty("sendToText")]
        public bool SendToText { get; set; }

        [Required]
        [JsonProperty("sendToEmail")]
        public bool SendToEmail { get; set; }

        [Required]
        [JsonProperty("deviceId")]
        [StringLength(1000)]
        public string DeviceID { get; set; }

        [Required]
        [JsonProperty("deviceName")]
        [StringLength(1000)]
        public string DeviceName { get; set; }
    }
}