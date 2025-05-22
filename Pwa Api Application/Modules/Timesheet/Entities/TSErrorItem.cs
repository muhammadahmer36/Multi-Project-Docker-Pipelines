using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSErrorItem
    {
        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public string ErrorCode { get; set; }

        public string ErrorTitle { get; set; }
    }
}