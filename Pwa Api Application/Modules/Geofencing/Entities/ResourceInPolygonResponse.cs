namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class ResourceInPolygonResponse
    {
        public int ResourceId { get; set; }
        public GeofenceModeItem GeofenceMode { get; set; }
        public bool IsLocationValid { get; set; }

    }
}
