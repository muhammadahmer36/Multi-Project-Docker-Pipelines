using System;

namespace EcotimeMobileAPI.Modules.Balances.Entities
{
    public class BalancesParams
    {
        public int EmployeeCount { get; set; }
        public string CurrentEmpNum { get; set; }
        public int CurrentPageId { get; set; }
        public string TitleMessage { get; set; }
        public string TsgroupId { get; set; }
        public string CurrentEmployeeName { get; set; }
    }
}