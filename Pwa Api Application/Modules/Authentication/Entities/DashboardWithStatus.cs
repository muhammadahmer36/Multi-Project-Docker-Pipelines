using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class DashboardWithStatus
    {
        public ValidationResponse ValidationResponse { get; set; }
        public DashboardResponse Dashboard { get; set; }
    }
}