namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSResourceInfo
    {
        public int ResourceId { get; set; }

        public string ResourceTitle { get; set; }

        public string ControllerName { get; set; }

        public string Header { get; set; }

        public string Footer { get; set; }

        public string EmployeeNameText { get; set; }

        public string EmployeeNumber { get; set; }

        public int UserCurrentRole { get; set; }

        public int UserRoles { get; set; }

        public int TsNum { get; set; }

        public int TsOption { get; set; }

        public bool TsDurationOnly { get; set; }
    }
}