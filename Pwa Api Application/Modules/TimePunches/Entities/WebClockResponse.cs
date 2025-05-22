using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class WebClockResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public ResourceInfo ResourceInfo { get; set; }
        public WebClockInfo WebClockInfo { get; set; }
        public IList<PunchHistoryItem> PunchHistory { get; set; }
        internal ValidationResponse ValidationResponse { get; set; }
        public int? PunchHistoryDayLimit { get; set; }
    }
}