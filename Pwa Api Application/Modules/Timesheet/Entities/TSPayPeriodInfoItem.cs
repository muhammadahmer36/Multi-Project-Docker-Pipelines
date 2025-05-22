using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSPayPeriodInfoItem
    {
        public int PeriodIdentity { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool SelectedPayPeriod { get; set; }

        public string PayPeriod_Title { get; set; }

        public string PayFrequency { get; set; }
    }
}