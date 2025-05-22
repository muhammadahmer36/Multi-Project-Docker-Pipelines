using System.Threading.Tasks;
using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Notification.Entities;


namespace EcotimeMobileAPI.Modules.Notification.Repositories
{
    public interface INotificationRepository : IStoredProcRepository
    {
        Task<NotificationList> GetNotificationAsync(string employeeId);
    }
}
