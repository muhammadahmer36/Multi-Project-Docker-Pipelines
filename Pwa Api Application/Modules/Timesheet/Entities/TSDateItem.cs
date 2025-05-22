using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSDateItem
    {
        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public DateTime WeekStartDate { get; set; }

        public DateTime WeekEndDate { get; set; }

        public string WeekTitle { get; set; }

        public string WeekGroupTitle { get; set; }

        public string TsDateGroupTitle { get; set; }
    }
}