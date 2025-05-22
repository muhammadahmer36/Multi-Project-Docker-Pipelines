using System;
using System.Threading.Tasks;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.Timesheet.Repositories
{
    public interface ITimesheetRepository : IStoredProcRepository
    {
        Task<TimesheetResponse> Get(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity);
        Task<TSPayPeriodResponse> GetTimesheetByPayPeriod(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity);
        Task<TSWeeklyResponse> GetTimesheetByWeeks(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity);
        Task<TSDailyResponse> GetTimesheetByDays(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity);
        Task<TSNotesResponse> GetTimesheetNotes(int userAccountID, int resourceId, string employeeNumber, int viewtype, int? periodIdentity);
        Task<ValidationResponse> ExecuteTSAction(int userAccountID, string deviceID, ExecuteTSActionRequest request);
        Task<TimesheetCertifyUncertifyResponse> GetCertifyUncertifyTimesheet(int userAccountID, DateTime? date);
        Task<ValidationResponse> AddTSNote(int userAccountID, AddTSNoteRequest request);
        Task<TSManagerInfoResponse> GetTimesheetInfoForManager(int userAccountID, int resourceId, int? periodIdentity, string listOfEmployeeNumbers, string separator);
        Task<TSConfigurationResponse> GetTimesheetConfiguration(string employeeNumber,int periodIdentity, DateTime? tsDate, int? section);
        Task<TSSearchDataResponse> GetTimesheetSearchParamsInfo(int userAccountID, int resourceId, int groupId);
        Task<TSEmpSearchResultResponse> GetTimesheetSearchResultData(int userAccountID, TimesheetSearchResultRequest request);
        Task<TSGroupUserResponse> GetTimesheetGroupUsers(int userAccountID, string groupId, TimesheetSearchResultRequest request);
        Task<TSSearchResultResponse> GetTSSearchResults(string employeeNumber,int periodIdentity, int fieldIdToPopulate, string fieldIds, string fieldValues, DateTime? tsDate, int? section, string separator);
        Task<ValidationResponse> SaveTimesheet(int userAccountID, string deviceID, SaveTSRequest request);
        Task<ValidationResponse> DeleteTSByWeeks(int userAccountID, string deviceID, DeleteByWeeksRequest request);
        Task<ValidationResponse> DeleteTSByDays(int userAccountID, string deviceID, DeleteByDaysRequest request);
        Task<ValidationResponse> DeleteTSEntries(int userAccountID, string deviceID, DeleteTSEntriesRequest request);
    }
}