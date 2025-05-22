using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.TimePunches.Contexts
{
    public class TimePunchesContext : BaseContext
    {
        public TimePunchesContext(DbContextOptions<TimePunchesContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}