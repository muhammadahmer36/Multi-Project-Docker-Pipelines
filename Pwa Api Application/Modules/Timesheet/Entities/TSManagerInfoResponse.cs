using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSManagerInfoResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public IList<TSPPItem> PayPeriods { get; set; }
        public TSManagerInfoHeader ManagerInfoHeader { get; set; }
        public IList<TSEmployeeDetailsItem> EmployeeDetails { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}