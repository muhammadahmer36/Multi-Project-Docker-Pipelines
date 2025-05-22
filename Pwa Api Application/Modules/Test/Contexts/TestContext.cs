using EcotimeMobileAPI.CommonClasses.BaseClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.Modules.Test.Contexts
{
    public class TestContext : BaseContext
    {
        public TestContext(DbContextOptions<TestContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}