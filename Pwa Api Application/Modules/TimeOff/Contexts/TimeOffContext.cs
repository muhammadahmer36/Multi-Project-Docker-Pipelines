using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.TimeOff.Contexts
{
    public class TimeOffContext : BaseContext
    {
        public TimeOffContext(DbContextOptions<TimeOffContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}