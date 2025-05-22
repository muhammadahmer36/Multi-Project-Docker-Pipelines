using EcotimeMobileAPI.CommonClasses.BaseClasses;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Authentication.Contexts
{
    public class LoginItemContext : BaseContext
    {
        public LoginItemContext(DbContextOptions<LoginItemContext> options, IConfiguration config) : base(options, config)
        {
        }

        public DbSet<LoginItem> LoginItems { get; set; }
    }
}