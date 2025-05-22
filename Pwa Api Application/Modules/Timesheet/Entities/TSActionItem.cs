namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSActionItem
    {
        public int ActionId { get; set; }

        public string ActionTitle { get; set; }

        public string ActionDescription { get; set; }

        public string AlternateTitle { get; set; }

        public int DisplayOrder { get; set; }

        public string DisplayColor { get; set; }

        public int ViewType { get; set; }
    }
}