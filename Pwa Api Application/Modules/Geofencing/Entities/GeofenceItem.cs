using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceItem
    {
        public int GeofenceId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public int GeofenceVerticeId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}