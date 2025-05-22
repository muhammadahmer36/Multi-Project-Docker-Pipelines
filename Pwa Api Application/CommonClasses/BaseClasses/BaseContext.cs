using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EcotimeMobileAPI.CommonClasses.BaseClasses
{
    public class BaseContext : DbContext
    {
        private readonly IConfiguration _config;

        public BaseContext(DbContextOptions options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("HBSData"));
        }
    }
}