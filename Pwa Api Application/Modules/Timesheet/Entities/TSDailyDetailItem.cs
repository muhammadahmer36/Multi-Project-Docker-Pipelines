using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSDailyDetailItem
    {
        public int WeekNum { get; set; }

        public DateTime TsDate { get; set; }

        public string TimeIn_Display { get; set; }

        public string TimeOut_Display { get; set; }

        public int TimeIn_NextDay { get; set; }

        public int TimeOut_NextDay { get; set; }

        public string Duration_Display { get; set; }

        public string AdditionalInfo { get; set; }

        public int ErrorsCount { get; set; }

        public string ErrorDescription { get; set; }

        public string DoeCode { get; set; }

        public string DoeCode_Title { get; set; }

        public int Task1 { get; set; }

        public string Task1_Title { get; set; }

        public int Task2 { get; set; }

        public string Task2_Title { get; set; }

        public int Task3 { get; set; }

        public string Task3_Title { get; set; }

        public int Task4 { get; set; }

        public string Task4_Title { get; set; }

        public int Task5 { get; set; }

        public string Task5_Title { get; set; }

        public string DeptChrg { get; set; }

        public string DeptChrg_Title { get; set; }

        public int Quantity { get; set; }

        public string Quantity_Title { get; set; }

        public string Shift { get; set; }

        public string Shift_Title { get; set; }

        public int PositionId { get; set; }

        public string PositionId_Title { get; set; }

        public decimal PayRate { get; set; }

        public string PayRate_Title { get; set; }

        public bool InOut { get; set; }

        public DateTime TimeInDated { get; set; }

        public DateTime TimeOutDated { get; set; }

        public int Hours { get; set; }

        public int Minutes { get; set; }

        public decimal Duration { get; set; }

        public int Id { get; set; }

        public TSDailyDetailItem Clone()
        {
            return new TSDailyDetailItem
            {
                WeekNum          = this.WeekNum,
                TsDate           = this.TsDate,
                TimeIn_Display   = this.TimeIn_Display,
                TimeOut_Display  = this.TimeOut_Display,
                TimeIn_NextDay   = this.TimeIn_NextDay,
                TimeOut_NextDay  = this.TimeOut_NextDay,
                Duration_Display = this.Duration_Display,
                AdditionalInfo   = this.AdditionalInfo,
                ErrorsCount      = this.ErrorsCount,
                ErrorDescription = this.ErrorDescription,
                DoeCode          = this.DoeCode,
                DoeCode_Title    = this.DoeCode_Title,
                Task1            = this.Task1,
                Task1_Title      = this.Task1_Title,
                Task2            = this.Task2,
                Task2_Title      = this.Task2_Title,
                Task3            = this.Task3,
                Task3_Title      = this.Task3_Title,
                Task4            = this.Task4,
                Task4_Title      = this.Task4_Title,
                Task5            = this.Task5,
                Task5_Title      = this.Task5_Title,
                DeptChrg         = this.DeptChrg,
                DeptChrg_Title   = this.DeptChrg_Title,
                Quantity         = this.Quantity,
                Quantity_Title   = this.Quantity_Title,
                Shift            = this.Shift,
                Shift_Title      = this.Shift_Title,
                PositionId       = this.PositionId,
                PositionId_Title = this.PositionId_Title,
                PayRate          = this.PayRate,
                PayRate_Title    = this.PayRate_Title,
                InOut            = this.InOut,
                TimeInDated      = this.TimeInDated,
                TimeOutDated     = this.TimeOutDated,
                Hours            = this.Hours,
                Minutes          = this.Minutes,
                Duration         = this.Duration,
                Id               = this.Id
            };
        }
    }
}