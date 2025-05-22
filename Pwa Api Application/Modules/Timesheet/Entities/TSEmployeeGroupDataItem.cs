using System;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSEmployeeGroupDataItem
    {
        public string EmpNo { get; set; }
        public DateTime PPEndDate { get; set; }
        public string EmployeeName { get; set; }
        public string FlsaCode { get; set; }
        public string SalaryHourly { get; set; }
        public string EmpCat { get; set; }
        public string TsNum { get; set; }
        public decimal WorkedTot { get; set; }
        public decimal ExceptionTot { get; set; }
        public decimal TotalHours { get; set; }
        public int Approved { get; set; }
        public int Numdays { get; set; }
        public int Completed { get; set; }
        public int NumNotes { get; set; }
        public int NumErrors { get; set; }
        public decimal Othours { get; set; }
        public string FlsaCodeSalHrl { get; set; }
        public decimal OnCall { get; set; }
        public int AccessLevel { get; set; }
        public int TimesheetGroupId { get; set; }
        public string TimesheetGroupTitle { get; set; }
        public string AccessLevelTitle { get; set; }
        public int Errors { get; set; }
        public int Warnings { get; set; }
        public decimal PremiumInput { get; set; }
        public string PayFrequency { get; set; }
        public string GroupPayperiodTitle { get; set; }
        public bool Attachments { get; set; }
        public int AllowApproveComplete { get; set; }
    }
}