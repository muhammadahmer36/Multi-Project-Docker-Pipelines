using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Authentication.Contexts
{
    public class AuthenticationContext : BaseContext
    {
        public AuthenticationContext(DbContextOptions<AuthenticationContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}