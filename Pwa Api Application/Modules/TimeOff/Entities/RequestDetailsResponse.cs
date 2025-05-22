using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestDetailsResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public RequestDetailsInfo RequestDetailsInfo { get; set; }
        public IList<DailyInfoItem> DailyInfoItems { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}