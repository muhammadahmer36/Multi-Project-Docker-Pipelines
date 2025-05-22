using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSWeeklyResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSResourceInfo ResourceInfo { get; set; }
        public TSPPSummaryItem PayPeriodSummary { get; set; }
        public IList<TSInputDataItem> TimesheetInputData { get; set; }
        public IList<TSCalculatedDataItem> TimesheetCalculatedData { get; set; }
        public IList<TSWeekItem> Weeks { get; set; }
        public IList<TSActionItem> Actions { get; set; }
    }
}