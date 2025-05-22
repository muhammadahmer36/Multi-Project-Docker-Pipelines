using System.Threading.Tasks;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.Common.Repositories
{
    public interface ICommonRepository : IStoredProcRepository
    {
        Task<EmployeeSearchResponse> GetEmployeeSearchResults(int userAccountID, int resourceId, string searchString, int? periodIdentity, int? searchByMode);
        Task<TSGroupResponse> GetTimesheetGroupsInfo(int userAccountID, int resourceId);
    }
}