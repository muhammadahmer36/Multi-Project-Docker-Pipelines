using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Balances.Contexts
{
    public class BalancesContext : BaseContext
    {
        public BalancesContext(DbContextOptions<BalancesContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}