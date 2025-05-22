namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSNoteDetailsItem
    {
        public string EmpNum { get; set; }

        public int PeriodIdentity { get; set; }

        public string EnteredByName { get; set; }

        public string EnteredOn { get; set; }

        public string Note { get; set; }

        public bool ManagerNote { get; set; }
    }
}