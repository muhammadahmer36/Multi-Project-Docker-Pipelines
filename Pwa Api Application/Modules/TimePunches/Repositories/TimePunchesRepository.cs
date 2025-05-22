using Dapper;
using System;
using System.Data;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.TimePunches.Contexts;
using EcotimeMobileAPI.Modules.TimePunches.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace EcotimeMobileAPI.Modules.TimePunches.Repositories
{
    public class TimePunchesRepository : StoredProcRepository, ITimePunchesRepository
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;
        public TimePunchesRepository(TimePunchesContext dbContext,
            IConfiguration config,
            ILogger<AuthenticationRepository> logger) : 
            base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }

        public PunchAdditionalInfo GetAllAdditionalInfo(int userAccountID)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);

            // Call the stored procedure
            using var multipleQueryResult = connection.QueryMultiple("[dbo].[GetAll_AdditionalInfo]", parameters, commandType: CommandType.StoredProcedure);

            var punchAdditionalInfo = new PunchAdditionalInfo
            {
                PunchDetails = multipleQueryResult.MapToList<PunchDetails>(),
                PunchTasksList = multipleQueryResult.MapToList<DropDownIntItem>(),
                TaskRelation = multipleQueryResult.MapToList<TaskRelationItem>(),
            };

            if (punchAdditionalInfo.PunchTasksList.Count > 0 && punchAdditionalInfo.TaskRelation.Count > 0)
            {
                PopulateRelations(punchAdditionalInfo.TaskRelation, punchAdditionalInfo.PunchTasksList);
            }

            return punchAdditionalInfo;
        }

        public ClockWidgetResponse GetClockWidgetConfigurationData(int userAccountID)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);

            // Call the stored procedure
            using var multipleQueryResult = connection.QueryMultiple("[dbo].[PunchTimeFunctionsConfig_Get]", parameters, commandType: CommandType.StoredProcedure);
            
            return new ClockWidgetResponse
            {
                ClockWidgetItems = multipleQueryResult.MapToList<ClockWidgetItem>(),
                UTCDateTime = multipleQueryResult.MapToSingle<DateTime>(),
                LastPunch = multipleQueryResult.MapToSingle<string>(),
                DateTimeFormats = multipleQueryResult.MapToSingle<TimeFormatItem>(),
                IsGeofencingApplicable = multipleQueryResult.MapToSingle<bool>(),
                Dashboard = MapDashboardResponse(multipleQueryResult),
                Actions = multipleQueryResult.MapToList<ActionItem>()
            };
        }

        public async Task<PunchAdditionalInfo> InsertTimePunchingAsync(NewTimePunchRequest request, int userAccountID, string deviceName)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_functionid", request.FunctionId);
            parameters.Add("in_timestamp", request.Timestamp);
            parameters.Add("in_devicename", request.Source);
            parameters.Add("in_geolocation", request.GeoLocation);
            parameters.Add("in_timezoneoffset", request.TimeZoneOffset);
            parameters.Add("in_utcTimestamp", request.UtcTimestamp);
            parameters.Add("in_IsOfflinePunch", request.IsOfflinePunch);
            parameters.Add("in_ClientGuidId", request.ClientGuidId);

            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[PunchTime_Ins]", parameters, commandType: CommandType.StoredProcedure);

            var punchAdditionalInfo = new PunchAdditionalInfo
            {
                 ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                 ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                 PunchHeader = multipleQueryResult.MapToSingle<PunchHeader>(),
                 PunchDetails = multipleQueryResult.MapToList<PunchDetails>(),
                 PunchTasksList = multipleQueryResult.MapToList<DropDownIntItem>(),
                 TaskRelation = multipleQueryResult.MapToList<TaskRelationItem>(),
            };

            if (punchAdditionalInfo.PunchTasksList != null  && punchAdditionalInfo.TaskRelation != null)
            {
                PopulateRelations(punchAdditionalInfo.TaskRelation, punchAdditionalInfo.PunchTasksList);
            }

            return punchAdditionalInfo;
        }

        public async Task<ValidationResponse> UpdateTimePunchAsync(UpdateTimePunchRequest request, int userAccountID)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_id", request.Id);
            parameters.Add("in_fieldids", request.FieldIds);
            parameters.Add("in_fieldvalues", request.FieldValues);
            parameters.Add("in_separator", request.Separator);
            parameters.Add("in_ClientGuidId", request.ClientGuidId);
            parameters.Add("in_useraccountid", userAccountID);

            return await connection.QueryFirstAsync<ValidationResponse>("[dbo].[PunchTime_Upd]", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<WebClockResponse> GetHistory(int userAccountID, int resourceId, DateTime? historyDate, DateTime? historyEndDate, [Required] decimal timeZoneOffset)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_historydate", historyDate);
            parameters.Add("in_endDate", historyEndDate);
            parameters.Add("in_timeZoneOffset", timeZoneOffset);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[PunchTime_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new WebClockResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<ResourceInfo>(),
                WebClockInfo = multipleQueryResult.MapToSingle<WebClockInfo>(),
                PunchHistory = multipleQueryResult.MapToList<PunchHistoryItem>(),
                ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                PunchHistoryDayLimit = multipleQueryResult.MapToSingle<int?>(),
            };
        }
        
        public async Task<PunchHistoryResponse> GetPunchTimeHistory(int userAccountID, DateTime? historyDate, DateTime? historyEndDate)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_date", historyDate);
            parameters.Add("in_endDate", historyEndDate);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[PunchTimeHistory_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new PunchHistoryResponse
            {
                WebClockInfo = multipleQueryResult.MapToSingle<WebClockInfo>(),
                PunchHistory = multipleQueryResult.MapToList<PunchHistoryItem>(),
                ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
            };
        }

        private DashboardResponse MapDashboardResponse(SqlMapper.GridReader reader)
        {
            DashboardResponse item = new DashboardResponse
            {
                ApplicationInfo = reader.MapToSingle<ApplicationInfo>(),
                ResourceInfo = reader.MapToSingle<ResourceInfo>(),
                DashboardItems = reader.MapToList<DashboardItem>(),
            };

            if (item.ApplicationInfo == null || (item.ApplicationInfo != null && string.IsNullOrEmpty(item.ApplicationInfo.UserEmpNo)))
                return new DashboardResponse
                {
                    DashboardItems = item.DashboardItems
                };

            return item;
        }

        private void PopulateRelations(IList<TaskRelationItem> taskRelations, IList<DropDownIntItem> punchTasksList)
        {
            if (taskRelations.Count > 0)
            {
                foreach (var punchTask in punchTasksList)
                {
                    var relations = taskRelations
                        .Where(tr => tr.ParentId == punchTask.Id && tr.ParentLevelId == punchTask.TaskLevel)
                        .GroupBy(tr => tr.ChildlevelId)
                        .Select(group => new RelationItem
                        {
                            TaskLevel = group.Key,
                            Value = group.Select(tr => tr.ChildId).ToList()
                        })
                        .ToList();

                    punchTask.Relation = relations;
                }
            }
        }
    }
}