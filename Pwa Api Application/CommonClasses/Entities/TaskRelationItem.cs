namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class TaskRelationItem
    {
        public int ParentId { get; set; }
        internal int ChildId { get; set; }
        internal int ParentLevelId { get; set; }
        internal int ChildlevelId { get; set; }
        public string ParentTaskCode { get; set; }
        public string ChildTaskCode { get; set; }
        public string ParentTaskDescr { get; set; }
        public string ChildTaskDescr { get; set; }
        public bool Active { get; set; }
    }
}