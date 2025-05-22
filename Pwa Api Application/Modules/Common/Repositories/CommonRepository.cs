using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Dapper;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Common.Contexts;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.Common.Repositories
{
    public class CommonRepository : StoredProcRepository, ICommonRepository
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;
        public CommonRepository(CommonContext dbContext,
            IConfiguration config,
            ILogger<AuthenticationRepository> logger) : base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }
        public async Task<EmployeeSearchResponse> GetEmployeeSearchResults(int userAccountID, int resourceId, string searchString, int? periodIdentity, int? searchByMode)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_searchstring", searchString);
            parameters.Add("in_periodidentity", periodIdentity.HasValue == true ? periodIdentity : 0);
            parameters.Add("in_searchbymode", searchByMode.HasValue == true ? searchByMode : 0);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[EmployeesAutocomplete_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new EmployeeSearchResponse
            {
                EmployeeSearchItems = multipleQueryResult.MapToList<EmployeeSearchItem>(),
            };
        }

        public async Task<TSGroupResponse> GetTimesheetGroupsInfo(int userAccountID, int resourceId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetGroups_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSGroupResponse
            {
                TimesheetGroups = multipleQueryResult.MapToList<TSGroupItem>(),
            };
        }
    }
}