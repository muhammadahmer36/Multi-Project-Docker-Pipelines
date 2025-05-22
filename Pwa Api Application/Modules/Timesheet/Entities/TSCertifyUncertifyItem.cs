using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSCertifyUncertifyItem
    {
        public int Id { get; set; }

        public char Completed { get; set; }

        public char Approved { get; set; }

        public string Payperiod_title { get; set; }

        public string Reported_duration { get; set; }

        public string Calculated_duration { get; set; }
    }
}