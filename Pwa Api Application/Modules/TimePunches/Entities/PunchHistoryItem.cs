namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class PunchHistoryItem
    {
        public string Type { get; set; }

        public string Time { get; set; }

        public string Source { get; set; }
        public string Date { get; set; }
        public string Day { get; set; }
        public string Status { get; set; }
        public string Location { get; set; }
    }
}