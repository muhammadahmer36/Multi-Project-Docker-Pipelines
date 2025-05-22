using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.CommonClasses.BaseClasses;

namespace EcotimeMobileAPI.Modules.Notifications.Contexts
{
    public class NotificationContext : BaseContext
    {
        public NotificationContext(DbContextOptions<NotificationContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}
