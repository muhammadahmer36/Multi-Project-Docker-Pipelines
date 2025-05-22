using System.Collections.Generic;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class DropDownIntItem
    {
        public int FldId { get; set; }
        public int TaskLevel { get; set; }
        internal int DataElementId { get; set; }
        internal int FunctionId { get; set; }
        public string Code { get; set; }
        public int Id { get; set; }

        public string Description { get; set; }

        public List<RelationItem> Relation { get; set; } = new List<RelationItem>();
    }
}