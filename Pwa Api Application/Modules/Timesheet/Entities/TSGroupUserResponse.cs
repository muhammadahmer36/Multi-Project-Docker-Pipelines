using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSGroupUserResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSSearchResourceInfo ResourceInfo { get; set; }
        public TSSearchPayPeriodItem PayPeriod { get; set; }
        public IList<TSEmployeeGroupDataItem> EmployeeList { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}