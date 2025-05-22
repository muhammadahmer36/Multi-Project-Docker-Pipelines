using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSInputDataItem
    {
        public int WeekNum { get; set; }

        public DateTime WeekStartDate { get; set; }

        public DateTime WeekEndDate { get; set; }

        public DateTime TsDate { get; set; }

        public string GroupTitle { get; set; }

        public string PayCodeName { get; set; }

        public string Duration { get; set; }

        public bool ErrorExists { get; set; }

        public string ErrorDescription { get; set; }
    }
}