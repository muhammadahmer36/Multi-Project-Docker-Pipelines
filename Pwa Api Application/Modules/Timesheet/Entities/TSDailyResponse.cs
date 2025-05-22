using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSDailyResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSResourceInfo ResourceInfo { get; set; }
        public TSPPSummaryItem DailySummary { get; set; }
        public IEnumerable<TSDailyHeaderItem> DailyItems { get; set; }
        internal IList<TSDailyDetailItem> ItemDetails { get; set; }
        public IList<TSActionItem> Actions { get; set; }
    }
}