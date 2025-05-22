using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSDailyTimeEntries
    {
        public DateTime TsDate { get; set; }

        public int Id { get; set; }

        public DateTime TimeIn { get; set; }

        public DateTime TimeOut { get; set; }

        public string Duration { get; set; }
    }
}