
using Microsoft.EntityFrameworkCore;
using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.AlertControlContext.Contexts
{
    public class AlertControlContext : BaseContext
    {
        public AlertControlContext(DbContextOptions<AlertControlContext> options, IConfiguration config) : base(options, config)
        {
        }
    
    }
}
