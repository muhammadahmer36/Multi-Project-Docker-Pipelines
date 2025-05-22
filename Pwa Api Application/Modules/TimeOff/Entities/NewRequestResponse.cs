using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class NewRequestResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public NewRequestInfo NewRequestInfo { get; set; }
        public IList<PayCodeItem> PayCodes { get; set; }
        public IList<RequestInterval> ExistingRequestIntervals { get; set; }
    }
}