using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.TimeOff.Entities;
using EcotimeMobileAPI.Modules.TimeOff.Contexts;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.TimeOff.Repositories
{
    public class TimeOffRepository : StoredProcRepository, ITimeOffRepository
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;
        public TimeOffRepository(TimeOffContext dbContext,
            IConfiguration config,
            ILogger<AuthenticationRepository> logger) : 
            base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }
    
        public async Task<RequestDetailsResponse> GetRequestDetails(int userAccountID, int resourceId, int? requestId, DateTime? startDate, DateTime? endDate, string listOfPayCodeIds, string employeeNumber, string separator)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_requestid", requestId);
            parameters.Add("in_startdate", startDate);
            parameters.Add("in_enddate", endDate);
            parameters.Add("in_listofpaycodeids", listOfPayCodeIds);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_separator", separator);
            parameters.Add("in_isnewapp", true);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffDetails_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new RequestDetailsResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                RequestDetailsInfo = multipleQueryResult.MapToSingle<RequestDetailsInfo>(),
                DailyInfoItems = multipleQueryResult.MapToList<DailyInfoItem>(),
                Actions = multipleQueryResult.MapToList<ActionItem>(),
            };
        }

        public async Task<TimeOffResponse> GetTimeOff(int userAccountID, TimeOffGetRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_date", request.Date);
            parameters.Add("in_managermode", request.ManagerMode);
            parameters.Add("in_listofemployeenumbers", request.ListOfEmployeeNumbers);
            parameters.Add("in_listofreviewstatuscodes", request.ListOfReviewStatusCodes);
            parameters.Add("in_timesheetgroup", request.GroupId);
            parameters.Add("in_separator", request.Separator);
            parameters.Add("in_isnewapp", true);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timeoff_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TimeOffResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                RequestInfo = multipleQueryResult.MapToSingle<RequestInfo>(),
                SearchConfiguration = multipleQueryResult.MapToList<SearchConfiguration>(),
                HolidayInfo = multipleQueryResult.MapToList<HolidayInfo>(),
                SummaryInfo = multipleQueryResult.MapToList<RequestSummaryInfo>(),
                Actions = multipleQueryResult.MapToList<ActionItem>(),
                RequestActions = multipleQueryResult.MapToList<RequestActionInfo>(),
            };
        }

        public async Task<NewRequestResponse> AddNewRequest(int userAccountID, int resourceId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffNewRequestHeader_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new NewRequestResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                NewRequestInfo = multipleQueryResult.MapToSingle<NewRequestInfo>(),
                PayCodes = multipleQueryResult.MapToList<PayCodeItem>(),
                ExistingRequestIntervals = multipleQueryResult.MapToList<RequestInterval>(),
            };
        }

        public async Task<ValidationResponse> AddTimeOffNote(int userAccountID, AddTimeOffNoteRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_requestid", request.RequestId);
            parameters.Add("in_note", request.Note);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffNotes_Ins]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<ValidationResponse> ExecuteAction(int userAccountID, ExecuteActionRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_actionid", request.ActionId);
            parameters.Add("in_requestedrequestids", request.RequestedRequestIds);
            parameters.Add("in_managermode", request.ManagerMode);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffAction_Exec]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<TimeOffNotesResponse> GetTimeOffNotes(int userAccountID, int resourceId, int requestId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_requestid", requestId);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffNotes_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TimeOffNotesResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                NotesSummary = multipleQueryResult.MapToSingle<RequestNoteSummary>(),
                NotesDetails = multipleQueryResult.MapToList<RequestNoteDetails>(),
                Actions = multipleQueryResult.MapToList<ActionItem>(),
            };
        }

        public async Task<TimeOffSaveResponse> SaveTimeOffRequests(int userAccountID, SaveTimeOffDataRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_requestid", request.RequestId);
            parameters.Add("in_listofdates", request.ListOfDates);
            parameters.Add("in_listofpaycodeids", request.ListOfPayCodeIds);
            parameters.Add("in_listofdurations", request.ListOfDurations);
            parameters.Add("in_headerstartdate", request.HeaderStartDate);
            parameters.Add("in_headerenddate", request.HeaderEndDate);
            parameters.Add("in_separator", request.Separator);
            parameters.Add("in_isedit", request.IsEdit);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimeoffRequest_Sav]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<TimeOffSaveResponse>();
        }
    }
}