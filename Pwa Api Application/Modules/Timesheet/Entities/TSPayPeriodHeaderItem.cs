using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSPayPeriodHeaderItem
    {
        public TSPayPeriodHeaderItem()
        {
            PayPeriodDetails = new HashSet<TSPayPeriodDetailItem>();
        }

        public int WeekNum { get; set; }

        public string Title { get; set; }

        public string ReportedHours { get; set; }

        public int ErrorsCount { get; set; }

        public string ErrorDescription { get; set; }

        public ICollection<TSPayPeriodDetailItem> PayPeriodDetails { get; set; }

        public TSPayPeriodHeaderItem Clone()
        {
            return new TSPayPeriodHeaderItem
            {
                WeekNum          = this.WeekNum,
                Title            = this.Title,
                ReportedHours    = this.ReportedHours,
                ErrorsCount      = this.ErrorsCount,
                ErrorDescription = this.ErrorDescription
            };
        }
    }
}