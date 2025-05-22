using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class AdditionalInfoResponse
    {
        public IList<PunchDetails> PunchDetails { get; set; }
        public IList<DropDownIntItem> PunchTasksList { get; set; }
        internal IList<TaskRelationItem> TaskRelation { get; set; }
    }
}