using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TimesheetResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSResourceInfo ResourceInfo { get; set; }
        public TSPPSummaryItem TimesheetHeader { get; set; }
        public IList<TSPayPeriodItem> PayPeriodsList { get; set; }
        public IList<TSDateItem> TimesheetDates { get; set; }
        public IList<TSErrorItem> TimesheetErrors { get; set; }
        public IList<TSDailyDetailItem> TimesheetInputData { get; set; }
        public IList<EmployeeRecordInfoItem> TimesheetCalculatedData { get; set; }
        public IList<TSActionItem> Actions { get; set; }
    }
}