using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceDetailItem: GeofenceItem
    {
        public int ResourceId { get; set; }
        public int GeofenceModeId { get; set; }
        public string GeofenceModeTitle { get; set; }
        public string GeofenceModeDescription { get; set; }
        public string GeofenceModeApplicationMessage { get; set; }
    }
}