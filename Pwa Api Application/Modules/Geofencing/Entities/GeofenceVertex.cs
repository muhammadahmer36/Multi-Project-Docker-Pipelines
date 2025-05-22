using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceVertex
    {

        public int Id { get; set; }

        [Required]
        public int GeofenceId { get; set; }
   
        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Required]
        public string ActionUser { get; set; }
    }
}