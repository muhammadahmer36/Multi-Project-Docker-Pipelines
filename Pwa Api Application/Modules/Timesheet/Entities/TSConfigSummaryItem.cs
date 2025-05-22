namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSConfigSummaryItem
    {
        public int TsNum { get; set; }

        public int TsOption { get; set; }

        public bool TsDurationOnly { get; set; }

        public int InputIncrementMins { get; set; }
    }
}