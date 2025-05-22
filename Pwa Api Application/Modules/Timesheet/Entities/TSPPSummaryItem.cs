using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSPPSummaryItem
    {
        public int PeriodIdentity { get; set; }

        public string TableTitle { get; set; }

        public DateTime PayPeriodStartDate { get; set; }

        public DateTime PayPeriodEndDate { get; set; }

        public string PayFrequency { get; set; }

        public bool CompleteStatus_Code { get; set; }

        public string CompleteStatus_Title { get; set; }

        public string CompleteStatus_Color { get; set; }

        public bool ApproveStatus_Code { get; set; }

        public string ApproveStatus_Title { get; set; }

        public string ApproveStatus_Color { get; set; }

        public bool LockStatus_Code { get; set; }

        public string LockStatus_Title { get; set; }

        public string LockStatus_Color { get; set; }

        public bool Timesheet_ReadOnly { get; set; }

        public int NotesCount { get; set; }

        public string CertifyMessage { get; set; }

        public int ResourceInstanceId { get; set; }
    }
}
