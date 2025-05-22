using EcotimeMobileAPI.Filters.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceVertexRequest
    {

        public int Id { get; set; }

        [Required]
        [NonZeroDoubleOrString(ErrorMessage = "Geofence is Required")]
        public int GeofenceId { get; set; }

   
        [Required]
        [NonZeroDoubleOrString(ErrorMessage = "Latitude is Required")]
        public double Latitude { get; set; }

        [Required]
        [NonZeroDoubleOrString(ErrorMessage = "Longitude is Required")]
        public double Longitude { get; set; }


        [Required(ErrorMessage = "ActionUser is required.")]
        [NotEmpty(ErrorMessage = "ActionUser is required.")]
        public string ActionUser { get; set; }
    }
}