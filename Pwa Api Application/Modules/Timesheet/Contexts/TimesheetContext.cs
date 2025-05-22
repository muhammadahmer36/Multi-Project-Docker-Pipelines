using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Timesheet.Contexts
{
    public class TimesheetContext : BaseContext
    {
        public TimesheetContext(DbContextOptions<TimesheetContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}