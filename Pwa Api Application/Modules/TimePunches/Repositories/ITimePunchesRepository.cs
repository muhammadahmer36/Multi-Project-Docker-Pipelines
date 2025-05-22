using System;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.TimePunches.Entities;

namespace EcotimeMobileAPI.Modules.TimePunches.Repositories
{
    public interface ITimePunchesRepository : IStoredProcRepository
    {
        ClockWidgetResponse GetClockWidgetConfigurationData(int userAccountID);
        PunchAdditionalInfo GetAllAdditionalInfo(int userAccountID);

        Task<PunchAdditionalInfo> InsertTimePunchingAsync(NewTimePunchRequest request, int userAccountID, string deviceName);
        Task<ValidationResponse> UpdateTimePunchAsync(UpdateTimePunchRequest request, int userAccountID);
        Task<WebClockResponse> GetHistory(int userAccountID, int resourceId, DateTime? historyDate, DateTime? historyEndDate, [Required] decimal timeZoneOffset);
        Task<PunchHistoryResponse> GetPunchTimeHistory(int userAccountID, DateTime? historyDate, DateTime? historyEndDate);
    }
}