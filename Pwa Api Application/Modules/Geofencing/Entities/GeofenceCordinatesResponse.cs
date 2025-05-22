using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class GeofenceCordinatesResponse
    {
        public GeofenceModeItem GeofenceMode { get; set; }
        public IList<GeofenceDetail> Geofences { get; set; }
        internal ValidationResponse Validation { get; set; }
        internal IList<GeofenceItem> GeofenceItems { get; set; }
        internal IList<GeofenceDetailItem> GeofenceDetailItems { get; set; }
    }
}