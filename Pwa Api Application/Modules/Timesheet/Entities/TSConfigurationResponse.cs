using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSConfigurationResponse
    {
        public TSConfigSummaryItem ConfigurationSummary { get; set; }
        public IList<TSConfigControlItem> ConfigurationControls { get; set; }
        public IList<TSConfigSelectListItem> ConfigurationSelectionList { get; set; }
        public IList<TSDailyTimeEntries> DailyTimeEntries { get; set; }
    }
}