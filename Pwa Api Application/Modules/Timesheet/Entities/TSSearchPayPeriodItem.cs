using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSSearchPayPeriodItem
    {
        public int PeriodIdentity { get; set; }

        public string TableTitle { get; set; }

        public DateTime PayPeriodStartDate { get; set; }

        public DateTime PayPeriodEndDate { get; set; }

        public string PayFrequency { get; set; }

        public string Statuses { get; set; }
    }
}