using System;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Dapper;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Timesheet.Contexts;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.Timesheet.Repositories
{
    public class TimesheetRepository : StoredProcRepository, ITimesheetRepository
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;
        public TimesheetRepository(TimesheetContext dbContext,
            IConfiguration config,
            ILogger<AuthenticationRepository> logger) : base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }
        public async Task<TimesheetResponse> Get(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_viewtype", viewtype);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TimesheetResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSResourceInfo>(),
                TimesheetHeader = multipleQueryResult.MapToSingle<TSPPSummaryItem>(),
                PayPeriodsList = multipleQueryResult.MapToList<TSPayPeriodItem>(),
                TimesheetDates = multipleQueryResult.MapToList<TSDateItem>(),
                TimesheetErrors = multipleQueryResult.MapToList<TSErrorItem>(),
                TimesheetInputData = multipleQueryResult.MapToList<TSDailyDetailItem>(),
                TimesheetCalculatedData = multipleQueryResult.MapToList<EmployeeRecordInfoItem>(),
                Actions = multipleQueryResult.MapToList<TSActionItem>(),
            };
        }

        public async Task<TSPayPeriodResponse> GetTimesheetByPayPeriod(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_viewtype", viewtype);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSPayPeriodResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSResourceInfo>(),
                PayPeriodSummary = multipleQueryResult.MapToSingle<TSPPSummaryItem>(),
                TimesheetInputData = multipleQueryResult.MapToList<TSInputDataItem>(),
                TimesheetCalculatedData = multipleQueryResult.MapToList<TSCalculatedDataItem>(),
                PayPeriods = multipleQueryResult.MapToList<TSPayPeriodItem>(),
                Actions = multipleQueryResult.MapToList<TSActionItem>(),
            };
        }

        public async Task<TSWeeklyResponse> GetTimesheetByWeeks(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_viewtype", viewtype);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSWeeklyResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSResourceInfo>(),
                PayPeriodSummary = multipleQueryResult.MapToSingle<TSPPSummaryItem>(),
                TimesheetInputData = multipleQueryResult.MapToList<TSInputDataItem>(),
                TimesheetCalculatedData = multipleQueryResult.MapToList<TSCalculatedDataItem>(),
                Weeks = multipleQueryResult.MapToList<TSWeekItem>(),
                Actions = multipleQueryResult.MapToList<TSActionItem>(),
            };
        }

        public async Task<TSDailyResponse> GetTimesheetByDays(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_viewtype", viewtype);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSDailyResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSResourceInfo>(),
                DailySummary = multipleQueryResult.MapToSingle<TSPPSummaryItem>(),
                DailyItems = multipleQueryResult.MapToList<TSDailyHeaderItem>(),
                ItemDetails = multipleQueryResult.MapToList<TSDailyDetailItem>(),
                Actions = multipleQueryResult.MapToList<TSActionItem>(),
            };
        }

        public async Task<ValidationResponse> ExecuteTSAction(int userAccountID, string deviceID, ExecuteTSActionRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_actionid", request.ActionId);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_listofemployeenumbers", request.ListOfEmployeeNumbers);
            parameters.Add("in_deviceid", deviceID);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetAction_Exec]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }
        
        public async Task<TimesheetCertifyUncertifyResponse> GetCertifyUncertifyTimesheet(int userAccountID, DateTime? date)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_date", date);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[GetAll_Certify_UnCertify]", parameters, commandType: CommandType.StoredProcedure);

            return new TimesheetCertifyUncertifyResponse
            {
                CertifyList = multipleQueryResult.MapToList<TSCertifyUncertifyItem>(),
                UnCertifyList = multipleQueryResult.MapToList<TSCertifyUncertifyItem>()
            };
        }

        public async Task<ValidationResponse> AddTSNote(int userAccountID, AddTSNoteRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_note", request.Note);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_employeenumber", request.EmployeeNumber);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetNotes_Ins]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<TSNotesResponse> GetTimesheetNotes(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_viewtype", viewtype);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSNotesResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSResourceInfo>(),
                DailySummary = multipleQueryResult.MapToSingle<TSPPSummaryItem>(),
                NoteDetails = multipleQueryResult.MapToList<TSNoteDetailsItem>(),
                Actions = multipleQueryResult.MapToList<TSActionItem>(),
            };
        }

        public async Task<TSManagerInfoResponse> GetTimesheetInfoForManager(int userAccountID, int resourceId, int? periodIdentity, string listOfEmployeeNumbers, string separator)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_listofemployeenumbers", listOfEmployeeNumbers);
            parameters.Add("in_separator", separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheets4Manager_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSManagerInfoResponse
            {
                ApplicationInfo =   multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo =      multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                PayPeriods =        multipleQueryResult.MapToList<TSPPItem>(),
                ManagerInfoHeader = multipleQueryResult.MapToSingle<TSManagerInfoHeader>(),
                EmployeeDetails =   multipleQueryResult.MapToList<TSEmployeeDetailsItem>(),
                Actions =           multipleQueryResult.MapToList<ActionItem>(),
            };
        }

        public async Task<TSConfigurationResponse> GetTimesheetConfiguration(string employeeNumber, int periodIdentity, DateTime? tsDate, int? section)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_tsdate", tsDate);
            parameters.Add("in_section", section);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetConfiguration_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSConfigurationResponse
            {
                ConfigurationSummary = multipleQueryResult.MapToSingle<TSConfigSummaryItem>(),
                ConfigurationControls = multipleQueryResult.MapToList<TSConfigControlItem>(),
                ConfigurationSelectionList = multipleQueryResult.MapToList<TSConfigSelectListItem>(),
                DailyTimeEntries = multipleQueryResult.MapToList<TSDailyTimeEntries>(),
            };
        }

        public async Task<TSSearchDataResponse> GetTimesheetSearchParamsInfo(int userAccountID, int resourceId, int groupId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", resourceId);
            parameters.Add("in_timesheetgroup", groupId);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetsSearchPrms_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSSearchDataResponse
            {
                PayFrequencies = multipleQueryResult.MapToList<PayFrequencyInfoItem>(),
                PayPeriods = multipleQueryResult.MapToList<TSPayPeriodInfoItem>(),
                SearchStatuses = multipleQueryResult.MapToList<TSSearchStatusItem>(),
            };
        }

        public async Task<TSEmpSearchResultResponse> GetTimesheetSearchResultData(int userAccountID, TimesheetSearchResultRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_listofemployeenumbers", request.ListOfEmployeeNumbers);
            parameters.Add("in_listofstatuscodes", request.ListOfStatusCodes);
            parameters.Add("in_statuscodescondition", request.StatusCodesCondition);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetSearchResult_Get]", parameters, commandType: CommandType.StoredProcedure);

            return new TSEmpSearchResultResponse
            {
                ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                ResourceInfo = multipleQueryResult.MapToSingle<TSSearchResourceInfo>(),
                PayPeriod = multipleQueryResult.MapToSingle<TSSearchPayPeriodItem>(),
                EmployeeDetails = multipleQueryResult.MapToList<TSEmployeeDetailsItem>(),
                Actions = multipleQueryResult.MapToList<ActionItem>(),
            };
        }

        public async Task<TSGroupUserResponse> GetTimesheetGroupUsers(int userAccountID, string groupId, TimesheetSearchResultRequest request)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_timesheetgroup", groupId);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_listofstatuscodes", request.ListOfStatusCodes);
            parameters.Add("in_statuscodescondition", request.StatusCodesCondition);
            parameters.Add("in_separator", request.Separator);

            _logger.LogInformation("Starting stored procedure execution");

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetGroups_Get_Users]", parameters, commandType: CommandType.StoredProcedure);

            stopwatch.Stop();
            _logger.LogInformation($"Stored procedure executed in {stopwatch.ElapsedMilliseconds} ms");

            stopwatch.Restart();
            var applicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>();
            var resourceInfo = multipleQueryResult.MapToSingle<TSSearchResourceInfo>();
            var payPeriod = multipleQueryResult.MapToSingle<TSSearchPayPeriodItem>();
            var actions = multipleQueryResult.MapToList<ActionItem>();
            var employeeList = multipleQueryResult.MapToList<TSEmployeeGroupDataItem>();
            stopwatch.Stop();
            _logger.LogInformation($"Mapping completed in {stopwatch.ElapsedMilliseconds} ms");

            return new TSGroupUserResponse
            {
                ApplicationInfo = applicationInfo,
                ResourceInfo = resourceInfo,
                PayPeriod = payPeriod,  
                EmployeeList = employeeList,
                Actions = actions
            };
        }

        public async Task<TSSearchResultResponse> GetTSSearchResults(string employeeNumber, int periodIdentity, int fieldIdToPopulate, string fieldIds, string fieldValues, DateTime? tsDate, int? section, string separator)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_employeenumber", employeeNumber);
            parameters.Add("in_periodidentity", periodIdentity);
            parameters.Add("in_fldidtopopulate", fieldIdToPopulate);
            parameters.Add("in_fldids", fieldIds);
            parameters.Add("in_fldvalues", fieldValues);
            parameters.Add("in_tsdate", tsDate);
            parameters.Add("in_sectionid", section);
            parameters.Add("in_separator", separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[MBL_TimesheetAutocompleteList]", parameters, commandType: CommandType.StoredProcedure);

            return new TSSearchResultResponse
            {
                SearchResults = multipleQueryResult.MapToList<DropDownIntItem>(),
            };
        }

        public async Task<ValidationResponse> SaveTimesheet(int userAccountID, string deviceID, SaveTSRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_resourceid", request.ResourceId);
            parameters.Add("in_employeenumber", request.EmployeeNumber);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_listoftsdates", request.ListOfTsDates);
            parameters.Add("in_listoftsdateweeknums", request.ListOfTsDateWeekNums);
            parameters.Add("in_id", request.Id);
            parameters.Add("in_datetimein", request.DateTimeIn);
            parameters.Add("in_datetimeout", request.DateTimeOut);
            parameters.Add("in_hours", request.Hours);
            parameters.Add("in_minutes", request.Minutes);
            parameters.Add("in_fldids", request.ListOfFieldIds);
            parameters.Add("in_fldvalues", request.ListOfFieldValues);
            parameters.Add("in_deviceid", deviceID);
            parameters.Add("in_mealbreak", DBNull.Value);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[Timesheet_Sav]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<ValidationResponse> DeleteTSByWeeks(int userAccountID, string deviceID, DeleteByWeeksRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_employeenumber", request.EmployeeNumber);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_deviceid", deviceID);
            parameters.Add("in_listofweeknum", request.ListOfWeekNum);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetDel_Weeks]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<ValidationResponse> DeleteTSByDays(int userAccountID, string deviceID, DeleteByDaysRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_employeenumber", request.EmployeeNumber);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_deviceid", deviceID);
            parameters.Add("in_listofdays", request.ListOfDays);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetDel_Days]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }

        public async Task<ValidationResponse> DeleteTSEntries(int userAccountID, string deviceID, DeleteTSEntriesRequest request)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", userAccountID);
            parameters.Add("in_employeenumber", request.EmployeeNumber);
            parameters.Add("in_periodidentity", request.PeriodIdentity);
            parameters.Add("in_tsdate", request.TsDate);
            parameters.Add("in_listofentryids", request.ListOfEntryIds);
            parameters.Add("in_deviceid", deviceID);
            parameters.Add("in_separator", request.Separator);

            // Call the stored procedure
            using var multipleQueryResult = await connection.QueryMultipleAsync("[dbo].[TimesheetDel_Entries]", parameters, commandType: CommandType.StoredProcedure);

            return multipleQueryResult.MapToSingle<ValidationResponse>();
        }
    }
}