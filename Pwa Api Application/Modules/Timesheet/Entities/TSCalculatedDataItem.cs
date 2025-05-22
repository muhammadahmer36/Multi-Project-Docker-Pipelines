using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSCalculatedDataItem
    {
        public int WeekNum { get; set; }

        public DateTime WeekStartDate { get; set; }

        public DateTime WeekEndDate { get; set; }

        public DateTime TsDate { get; set; }

        public string GroupTitle { get; set; }

        public string PayCodeName { get; set; }

        public string Duration { get; set; }
    }
}