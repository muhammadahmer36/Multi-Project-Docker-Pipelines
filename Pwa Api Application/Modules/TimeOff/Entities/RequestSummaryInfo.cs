using System;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestSummaryInfo
    {
        public int RequestId { get; set; }

        public string EmployeeNumber { get; set; }

        public string EmployeeName { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string StartEndDates_DisplayTitle { get; set; }

        public int TotalDays { get; set; }

        public string TotalDays_DisplayTitle { get; set; }

        public decimal TotalHours { get; set; }

        public string TotalHours_DisplayTitle { get; set; }

        public string SummedHoursByType_DisplayValue { get; set; }

        public bool NotesExist { get; set; }

        public int ReviewStatus_Code { get; set; }

        public string ReviewStatus_Title { get; set; }

        public string ReviewStatus_DisplayTitle { get; set; }

        public string ReviewStatus_Color { get; set; }

        public int ProcessStatus_Code { get; set; }

        public string ProcessStatus_Title { get; set; }

        public string ProcessStatus_DisplayTitle { get; set; }

        public string ProcessStatus_Color { get; set; }

        public bool Details_ReadOnly { get; set; }

        public bool Action_Delete { get; set; }

        public bool Action_Deny { get; set; }

        public bool Action_Approve { get; set; }

        public bool Action_Pending { get; set; }

        public int ResourceInstanceId { get; set; }
    }
}