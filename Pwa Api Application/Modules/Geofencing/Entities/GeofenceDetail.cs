using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceDetail
    {
        public Geofence Geofence { get; set; }
        public IList<GeofenceVertex> GeofenceVertices { get; set; }
    }
}