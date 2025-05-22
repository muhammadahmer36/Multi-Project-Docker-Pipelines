using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSEmpSearchResultResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSSearchResourceInfo ResourceInfo { get; set; }
        public TSSearchPayPeriodItem PayPeriod { get; set; }
        public IList<TSEmployeeDetailsItem> EmployeeDetails { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}