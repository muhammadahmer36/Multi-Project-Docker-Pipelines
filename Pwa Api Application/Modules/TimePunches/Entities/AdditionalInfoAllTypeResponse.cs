using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class AdditionalInfoAllTypeResponse
    {
        public AdditionalInfoResponse In { get; set; }
        public AdditionalInfoResponse Out { get; set; }
        public AdditionalInfoResponse Transfer { get; set; }
    }
}