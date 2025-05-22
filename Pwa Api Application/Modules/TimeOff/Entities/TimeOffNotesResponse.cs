using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class TimeOffNotesResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public RequestNoteSummary NotesSummary { get; set; }
        public IList<RequestNoteDetails> NotesDetails { get; set; }
        public IList<ActionItem> Actions { get; set; }
    }
}