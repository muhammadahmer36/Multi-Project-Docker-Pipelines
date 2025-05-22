using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceVerticeItem: BaseEntity
    {
        internal int Id { get; set; }
        internal int GeofenceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}