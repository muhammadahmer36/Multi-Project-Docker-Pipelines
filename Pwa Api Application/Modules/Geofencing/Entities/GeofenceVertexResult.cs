using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceVertexResult
    {
        public List<GeofenceVertex> GeofenceVertices { get; set; }
        public int Result { get; set; }
    }
}
