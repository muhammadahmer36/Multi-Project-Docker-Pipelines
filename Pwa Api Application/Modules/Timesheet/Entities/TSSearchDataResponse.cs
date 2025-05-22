using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSSearchDataResponse
    {
        public IList<PayFrequencyInfoItem> PayFrequencies { get; set; }
        public IList<TSPayPeriodInfoItem> PayPeriods { get; set; }
        public IList<TSSearchStatusItem> SearchStatuses { get; set; }
    }
}