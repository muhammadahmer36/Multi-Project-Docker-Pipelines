using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class PunchAdditionalInfo
    {
        public ValidationResponse ValidationResponse { get; set; }
        public ApplicationInfo ApplicationInfo { get; set; }
        public PunchHeader PunchHeader { get; set; }
        public IList<PunchDetails> PunchDetails { get; set; }
        public IList<DropDownIntItem> PunchTasksList { get; set; }
        internal IList<TaskRelationItem> TaskRelation { get; set; }
    }
}