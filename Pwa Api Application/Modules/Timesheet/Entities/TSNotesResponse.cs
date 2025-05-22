using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSNotesResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public TSResourceInfo ResourceInfo { get; set; }
        public TSPPSummaryItem DailySummary { get; set; }
        public IList<TSNoteDetailsItem> NoteDetails { get; set; }
        public IList<TSActionItem> Actions { get; set; }
    }
}