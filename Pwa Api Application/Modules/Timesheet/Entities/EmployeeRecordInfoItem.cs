using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class EmployeeRecordInfoItem
    {
        public string EmpNum { get; set; }

        public DateTime TsDate { get; set; }

        public int WeekNum { get; set; }

        public string Rec_Type { get; set; }

        public string DoeName { get; set; }

        public string DoeCode { get; set; }

        public decimal Duration { get; set; }
    }
}