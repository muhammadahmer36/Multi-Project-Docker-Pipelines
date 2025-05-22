using System;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSWeeklyHeaderItem
    {
        public TSWeeklyHeaderItem()
        {
            WeeklyDetails = new HashSet<TSWeeklyDetailItem>();
        }

        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public string TsDate_Title { get; set; }

        public string ReportedHours { get; set; }

        public int ErrorsCount { get; set; }

        public string ErrorDescription { get; set; }

        public ICollection<TSWeeklyDetailItem> WeeklyDetails { get; set; }

        public TSWeeklyHeaderItem Clone()
        {
            return new TSWeeklyHeaderItem
            {
                WeekNum          = this.WeekNum,
                TsDate           = this.TsDate,
                TsDate_Title     = this.TsDate_Title,
                ReportedHours    = this.ReportedHours,
                ErrorsCount      = this.ErrorsCount,
                ErrorDescription = this.ErrorDescription
            };
        }
    }
}