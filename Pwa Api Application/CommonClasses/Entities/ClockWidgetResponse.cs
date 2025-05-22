using System;
using System.Collections.Generic;
using EcotimeMobileAPI.Modules.TimePunches.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class ClockWidgetResponse
    {
        public IEnumerable<ClockWidgetItem> ClockWidgetItems { get; set; }
        public PunchAdditionalInfo PunchAdditionalInfo { get; set; }
        public string LastPunch { get; set; }
        public bool IsGeofencingApplicable { get; set; }
        public DateTime UTCDateTime { get; set; }
        public TimeFormatItem DateTimeFormats { get; set; }
        public DashboardResponse Dashboard { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}