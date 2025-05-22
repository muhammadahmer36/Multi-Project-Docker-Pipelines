namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSEmployeeDetailsItem
    {
        public string EmpNo { get; set; }

        public string EmployeeName { get; set; }

        public bool CompleteStatus_Code { get; set; }

        public string CompleteStatus_Title { get; set; }

        public string CompleteStatus_Color { get; set; }

        public bool ApproveStatus_Code { get; set; }

        public string ApproveStatus_Title { get; set; }

        public string ApproveStatus_Color { get; set; }

        public bool LockStatus_Code { get; set; }

        public string LockStatus_Title { get; set; }

        public string LockStatus_Color { get; set; }

        public string Duration_Display { get; set; }

        public int NotesCount { get; set; }

        public int ErrorCount { get; set; }

        public string ErrorDescription { get; set; }

        public string Actions { get; set; }
    }
}