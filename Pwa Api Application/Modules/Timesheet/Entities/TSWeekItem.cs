using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSWeekItem
    {
        public int WeekNum { get; set; }

        public DateTime WeekStartDate { get; set; }

        public DateTime WeekEndDate { get; set; }

        public string Week_Title { get; set; }
    }
}
