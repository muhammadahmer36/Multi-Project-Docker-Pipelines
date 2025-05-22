using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class PunchHistoryResponse
    {
        public WebClockInfo WebClockInfo { get; set; }
        public IList<PunchHistoryItem> PunchHistory { get; set; }
        internal ValidationResponse ValidationResponse { get; set; }
    }
}