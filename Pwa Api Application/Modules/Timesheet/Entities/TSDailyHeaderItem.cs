using System;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSDailyHeaderItem
    {
        public TSDailyHeaderItem()
        {
            DailyDetails = new HashSet<TSDailyDetailItem>();
        }

        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public string ReportedHours { get; set; }

        public ICollection<TSDailyDetailItem> DailyDetails { get; set; }

        public TSDailyHeaderItem Clone()
        {
            return new TSDailyHeaderItem { WeekNum = this.WeekNum, TsDate = this.TsDate, ReportedHours = this.ReportedHours };
        }
    }
}