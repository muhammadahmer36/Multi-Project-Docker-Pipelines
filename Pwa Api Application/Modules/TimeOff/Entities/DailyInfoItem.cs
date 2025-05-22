using System;

namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class DailyInfoItem
    {
        public DateTime RequestDate { get; set; }

        public bool ReadOnly { get; set; }

        public bool Holiday { get; set; }

        public decimal MaxDailyHours { get; set; }

        public int? PayCodeId1 { get; set; }

        public string PayCode1_DisplayValue { get; set; }

        public decimal? Duration1 { get; set; }

        public int? PayCodeId2 { get; set; }

        public string PayCode2_DisplayValue { get; set; }

        public decimal? Duration2 { get; set; }

        public string RequestDate_DisplayValue { get; set; }

        public string PayCodes_DisplayValue { get; set; }

        public string Duration_DisplayValue { get; set; }

        public string RecordProcessedCode { get; set; }
    }
}