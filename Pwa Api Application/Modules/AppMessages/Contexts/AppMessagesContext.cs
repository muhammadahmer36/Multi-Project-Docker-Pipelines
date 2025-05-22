
using Microsoft.EntityFrameworkCore;
using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.AppMessages.Contexts
{
    public class AppMessagesContext : BaseContext
    {
        public AppMessagesContext(DbContextOptions<AppMessagesContext> options, IConfiguration config) : base(options, config)
        {
        }
    
    }
}
