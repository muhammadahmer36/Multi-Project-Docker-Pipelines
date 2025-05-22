using System;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestDetailsInfo
    {
        public int RequestId { get; set; }

        public string TableTitle { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TotalDays { get; set; }

        public string TotalDays_DisplayTitle { get; set; }

        public decimal TotalHours { get; set; }

        public string TotalHours_DisplayTitle { get; set; }

        public int NotesCount { get; set; }

        public int ReviewStatus_Code { get; set; }

        public string ReviewStatus_Title { get; set; }

        public string ReviewStatus_DisplayTitle { get; set; }

        public string ReviewStatus_Color { get; set; }

        public int ProcessStatus_Code { get; set; }

        public string ProcessStatus_Title { get; set; }

        public string ProcessStatus_Color { get; set; }

        public bool Details_ReadOnly { get; set; }

        public int InputIncrementMins { get; set; }

        public string ProcessStatusDetails { get; set; }

        public int ResourceInstanceId { get; set; }
        public string ProcessStatus_DisplayTitle { get; set; }
    }
}