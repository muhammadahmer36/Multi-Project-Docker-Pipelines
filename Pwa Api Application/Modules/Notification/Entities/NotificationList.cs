using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Notification.Entities
{
    public class NotificationList
    {
        public IEnumerable<ManagerNotification> managerNotification { get; set; }
        public IEnumerable<UserNotification> userNotification { get; set; }

    }
}
