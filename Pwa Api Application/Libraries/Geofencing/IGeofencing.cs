using System.Collections.Generic;

namespace EcotimeMobileAPI.Libraries.Geofencing
{
    public interface IGeofencing
    {
        bool IsPointInPolygon(double latitude, double longitude, IEnumerable<Modules.Geofencing.Entities.Point> polygonCoordinates);

    }
}
