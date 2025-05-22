using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Notification.Entities;
using EcotimeMobileAPI.Modules.Notifications.Contexts;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.Notification.Repositories
{
    public class NotificationRepository : StoredProcRepository, INotificationRepository
    {

        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string connectionString;

        public NotificationRepository(NotificationContext dbContext, IConfiguration config, ILogger<AuthenticationRepository> logger) : base(dbContext)
        {
            _config = config;
            _logger = logger;
            connectionString = _config.GetConnectionString("HBSData");
        }

        public async Task<NotificationList> GetNotificationAsync(string employeeId)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parametersSPGetWebMessages = new DynamicParameters();
            parametersSPGetWebMessages.Add("@p_empno", employeeId); 

            var parametersSPGetMsg = new DynamicParameters();
            parametersSPGetMsg.Add("@EMP", employeeId);

            var managerNotifications = await connection.QueryAsync<ManagerNotification>("[dbo].[alert_getwebmessages]", parametersSPGetWebMessages, commandType: CommandType.StoredProcedure);


            var userNotifications = await connection.QueryAsync<UserNotification>("[dbo].[getmsg]", parametersSPGetMsg, commandType: CommandType.StoredProcedure);

            return new NotificationList() { managerNotification = managerNotifications.ToList(), userNotification = userNotifications.ToList() };
        }

       
    }

}
