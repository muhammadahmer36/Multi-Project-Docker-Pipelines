

namespace EcotimeMobileAPI.Modules.Notification.Entities
{
    public class ManagerNotification
    {
        public string Subject { get; set; }
        public string Message { get; set; }
        public int MessageOrder { get; set; }

        public int AlertId { get; set; }

    }
}
