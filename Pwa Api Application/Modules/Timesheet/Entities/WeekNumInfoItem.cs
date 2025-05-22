using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class WeekNumInfoItem
    {
        public int WeekNum { get; set; }

        public DateTime WeekStartDate { get; set; }

        public DateTime WeekEndDate { get; set; }

        public string Week_Title { get; set; }

        public string Week_DisplayTitle { get; set; }
    }
}