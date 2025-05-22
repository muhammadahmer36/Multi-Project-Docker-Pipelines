using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.CommonClasses.BaseClasses;

namespace EcotimeMobileAPI.Modules.Geofencing.Contexts
{
    public class GeofencingContext : BaseContext
    {
        public GeofencingContext(DbContextOptions<GeofencingContext> options, IConfiguration config) : base(options, config)
        {
        }
    }
}