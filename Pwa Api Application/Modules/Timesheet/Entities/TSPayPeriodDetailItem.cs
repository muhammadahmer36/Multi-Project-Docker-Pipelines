namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSPayPeriodDetailItem
    {
        public int WeekNum { get; set; }

        public string PayCodeName { get; set; }

        public string ReportedHours { get; set; }

        public string CalculatedHours { get; set; }

        public TSPayPeriodDetailItem Clone()
        {
            return new TSPayPeriodDetailItem { WeekNum = this.WeekNum, PayCodeName = this.PayCodeName, ReportedHours = this.ReportedHours, CalculatedHours = this.CalculatedHours };
        }
    }
}