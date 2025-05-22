using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class DashboardResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public ResourceInfo ResourceInfo { get; set; }
        public ICollection<DashboardItem> DashboardItems { get; set; }
    }
}