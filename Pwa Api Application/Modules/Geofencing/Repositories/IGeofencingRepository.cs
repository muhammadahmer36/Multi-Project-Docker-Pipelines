using System.Threading.Tasks;
using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Geofencing.Entities;

namespace EcotimeMobileAPI.Modules.Geofencing.Repositories
{
    public interface IGeofencingRepository : IStoredProcRepository, IGeofencingEnableRepository
    {

        Task<List<Point>> GetPolygonCoordinatesAsync(int employeeId);
        Task<bool> IsGeofencingApplicableAsync(int useraccountId);
        Task<GeofenceCordinatesResponse> GetAllResourceCordinates(int useraccountId);
        Task<int> SaveGeofence(Geofence geofence);
        Task<int> UpdateGeofence(Geofence geofence);
        Task<int> SaveGeofenceVertex(GeofenceVertexRequest geofenceVertex);
        Task<List<Geofence>> GetGeofences();
        Task<GeofenceVertexResult> GetGeofencesVertexByGeofenceId(int geofenceId);
        Task<GeofenceCordinatesResponse> GetPolygonCoordinatesAsync(int useraccountId, int resourceId);
        Task<int> DeleteGeofenceVertex(int geofenceId);

        Task SetGeoFenceWarningAlert(string timePunchType, string punchDeviceName, string punchDateTime ,string employeeNumber);
    }
}