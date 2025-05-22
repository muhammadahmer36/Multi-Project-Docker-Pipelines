using System;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class NewRequestInfo
    {
        public string TableTitle { get; set; }

        public string RequestStatusTitle { get; set; }

        public DateTime ValidationStartDate { get; set; }

        public DateTime ValidationEndDate { get; set; }

        public string ValidationMsgDateRange { get; set; }

        public int ValidationMaxDays { get; set; }

        public string ValidationMsgMaxDays { get; set; }

        public int NumberOfPayCodesInput { get; set; }

        public string ValidationMsgOverlapping { get; set; }
    }
}