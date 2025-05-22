using Dapper;
using System;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Geofencing.Contexts;
using EcotimeMobileAPI.Modules.Geofencing.Entities;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.Geofencing.Repositories
{
    public class GeofencingRepository : StoredProcRepository, IGeofencingRepository
    {

        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;
       
        public GeofencingRepository(GeofencingContext dbContext, IConfiguration config, ILogger<AuthenticationRepository> logger) : base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }

        public async Task<List<Point>> GetPolygonCoordinatesAsync(int useraccountId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("in_userccountid", useraccountId);
            var cordinates = await connection.QueryAsync<Point>("[dbo].[GetCordinatesByAccountId]", parameters, commandType: CommandType.StoredProcedure);

            return cordinates.ToList();
        }

        public async Task<bool> IsGeofencingApplicableAsync(int useraccountId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("in_userccountid", useraccountId);

            return await connection.QueryFirstOrDefaultAsync<bool>("SELECT [dbo].[IsGeofencingAllowed](@in_userccountid)", parameters, commandType: CommandType.Text);
        }

        public async Task<int> SaveGeofence(Geofence geofence)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("@Title", geofence.Title);
            parameters.Add("@ActionUser", geofence.ActionUser);
            parameters.Add("@Description", geofence.Description);

            var result = await connection.ExecuteScalarAsync<int>("[dbo].[Geofence_Insert]", parameters, commandType: CommandType.StoredProcedure);

            return result;
        }

        public async Task<int> UpdateGeofence(Geofence geofence)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("@in_ID", geofence.Id);
            parameters.Add("@in_Title", geofence.Title);
            parameters.Add("@in_Description", geofence.Description);
            parameters.Add("@in_ActionUser", geofence.ActionUser);

            var result = await connection.ExecuteScalarAsync<int>("[dbo].[Geofence_Update]", parameters, commandType: CommandType.StoredProcedure);

            return result;
        }

        public async Task<int> SaveGeofenceVertex(GeofenceVertexRequest geofenceVertex)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("@Latitude", geofenceVertex.Latitude);
            parameters.Add("@Longitude", geofenceVertex.Longitude);
            parameters.Add("@GeofenceId", geofenceVertex.GeofenceId);
            parameters.Add("@ActionUser", geofenceVertex.ActionUser);
            parameters.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); 


            var result = await connection.ExecuteScalarAsync<int>("[dbo].[GeofenceVertex_Insert]", parameters, commandType: CommandType.StoredProcedure);

            int resultCode = parameters.Get<int>("@Result");

            return resultCode;
        }

        public async Task<List<Geofence>> GetGeofences()
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            var geofences = await connection.QueryAsync<Geofence>("[dbo].[GetGeofenceByUser]", parameters, commandType: CommandType.StoredProcedure);

            return geofences.ToList();
        }
    

        public async Task<GeofenceVertexResult> GetGeofencesVertexByGeofenceId(int geofenceId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("@GeofenceId ", geofenceId);
            parameters.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
            var geofencesVertex = await connection.QueryAsync<GeofenceVertex>("[dbo].[GetGeofenceVertexByGeofenceId]", parameters, commandType: CommandType.StoredProcedure);

            var result = new GeofenceVertexResult
            {
                GeofenceVertices = geofencesVertex.ToList(),
                Result = parameters.Get<int>("@Result")
            };

            return result;

        }

        public async Task<GeofenceCordinatesResponse> GetPolygonCoordinatesAsync(int useraccountId, int resourceId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("in_resourceId", resourceId);
            parameters.Add("in_userccountid", useraccountId);
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[GetCordinatesByAccountIdAndResourceId]", parameters, commandType: CommandType.StoredProcedure);

            return new GeofenceCordinatesResponse
            {
                Validation = multipleQueryResult.MapToSingle<ValidationResponse>(),
                GeofenceMode = multipleQueryResult.MapToSingle<GeofenceModeItem>(),
                GeofenceItems = multipleQueryResult.MapToList<GeofenceItem>()
            };
        }

        public async Task<GeofenceCordinatesResponse> GetAllResourceCordinates(int useraccountId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("in_userccountid", useraccountId);
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[GetAllResourceCordinatesByAccountId]", parameters, commandType: CommandType.StoredProcedure);

            return new GeofenceCordinatesResponse
            {
                Validation = multipleQueryResult.MapToSingle<ValidationResponse>(),
                GeofenceDetailItems = multipleQueryResult.MapToList<GeofenceDetailItem>()
            };
        }

        public async Task<int> DeleteGeofenceVertex(int geofenceId)
        {

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("@GeofenceId", geofenceId);
            parameters.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output); // Add output parameter

            await connection.ExecuteAsync("[dbo].[Geofence_Delete]", parameters, commandType: CommandType.StoredProcedure);

            int resultCode = parameters.Get<int>("@Result");

            return resultCode;
        }

        public bool IsGeofencingEnabled()
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            return connection.QueryFirstOrDefault<bool>("SELECT [dbo].[IsGeofencingEnabled_syn]()", commandType: CommandType.Text);
        }

        public async Task SetGeoFenceWarningAlert(string timePunchType, string punchDeviceName ,string punchDateTime,string employeeNumber)
        {
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();

                var parameters = new DynamicParameters();
                parameters.Add("@TimePunchType", timePunchType);
                parameters.Add("@PunchDevice", punchDeviceName);
                parameters.Add("@DateTimePunch", punchDateTime);
                parameters.Add("@EmployeeNumber", employeeNumber);
                
                await connection.QueryFirstOrDefaultAsync("[dbo].[setGeofenceWarningAlert]", parameters, commandType: CommandType.StoredProcedure);
 
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetMaxTriesResult() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

    }
}