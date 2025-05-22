using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSGroupResponse
    {
        public IList<TSGroupItem> TimesheetGroups { get; set; }
    }
}