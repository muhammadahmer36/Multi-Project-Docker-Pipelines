using System;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class WebClockInfo
    {
        public string TableTitle { get; set; }

        public DateTime RequestedHistoryDate { get; set; }
        public DateTime RequestedEndHistoryDate { get; set; }
    }
}