using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Common.Contexts
{
    public class CommonContext : BaseContext
    {
        public CommonContext(DbContextOptions<CommonContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}