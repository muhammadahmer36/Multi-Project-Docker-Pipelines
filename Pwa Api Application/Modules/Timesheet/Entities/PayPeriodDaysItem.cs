using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class PayPeriodDaysItem
    {
        public DateTime TsDate { get; set; }

        public int WeekNum { get; set; }

        public string DisplayTitle { get; set; }

        public decimal DailyTotalHrs { get; set; }
    }
}