using System.Linq;
using System.Collections.Generic;
using NetTopologySuite.Geometries;


namespace EcotimeMobileAPI.Libraries.Geofencing
{
    public class Geofencing: IGeofencing
    {
        public bool IsPointInPolygon(double latitude, double longitude, IEnumerable<Modules.Geofencing.Entities.Point> polygonCoordinates)
        {
            var coordinates = new List<Coordinate>();
            foreach (var point in polygonCoordinates)
            {
                coordinates.Add(new Coordinate(point.Latitude, point.Longitude));
            }
            coordinates.Add(new Coordinate(polygonCoordinates.First().Latitude, polygonCoordinates.First().Longitude));

            var border = new Polygon(new LinearRing(coordinates.ToArray()));

            var pointToCheck = new NetTopologySuite.Geometries.Point(latitude, longitude);
            bool isInside = border.Contains(pointToCheck);

            return isInside;
        }
    }
}
