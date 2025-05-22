using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSWeeklyDetailItem
    {
        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public string PayCodeName { get; set; }

        public string ReportedHours { get; set; }

        public TSWeeklyDetailItem Clone()
        {
            return new TSWeeklyDetailItem { WeekNum = this.WeekNum, TsDate = this.TsDate, PayCodeName = this.PayCodeName, ReportedHours = this.ReportedHours };
        }
    }
}