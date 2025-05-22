using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class TimeOffResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public ValidationResponse ValidationResponse { get; set; }
        public RequestInfo RequestInfo { get; set; }
        public IList<SearchConfiguration> SearchConfiguration { get; set; }
        public IList<HolidayInfo> HolidayInfo { get; set; }
        public IList<RequestSummaryInfo> SummaryInfo { get; set; }
        public IList<ActionItem> Actions { get; set; }
        public IList<RequestActionInfo> RequestActions { get; set; }
    }
}