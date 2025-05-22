using System;
using System.Threading.Tasks;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.TimeOff.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.TimeOff.Repositories
{
    public interface ITimeOffRepository : IStoredProcRepository
    {
        Task<TimeOffResponse> GetTimeOff(int userAccountID, TimeOffGetRequest timeOffGetRequest);
        Task<RequestDetailsResponse> GetRequestDetails(int userAccountID, int resourceId, int? requestId, DateTime? startDate, DateTime? endDate, string listOfPayCodeIds, string employeeNumber, string separator);
        Task<ValidationResponse> ExecuteAction(int userAccountID, ExecuteActionRequest request);
        Task<NewRequestResponse> AddNewRequest(int userAccountID, int resourceId);
        Task<TimeOffSaveResponse> SaveTimeOffRequests(int userAccountID, SaveTimeOffDataRequest request);
        Task<TimeOffNotesResponse> GetTimeOffNotes(int userAccountID, int resourceId, int requestId);
        Task<ValidationResponse> AddTimeOffNote(int userAccountID, AddTimeOffNoteRequest request);
    }
}