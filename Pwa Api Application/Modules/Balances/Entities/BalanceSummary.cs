using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Balances.Entities
{
    public class BalanceSummary
    {
        public string EmpNum { get; set; }

        public int BalanceGroupId { get; set; }

        public string Category { get; set; }

        public string Hours { get; set; }
        internal string SectionName { get; set; }
        internal int SectionCode { get; set; }
        internal string ColumnType { get; set; }
        internal string ColumnName { get; set; }
    }
    public class Balance
    {
        public string Category { get; set; }
        public string Hours { get; set; }
    }
    public class GroupedBalance
    {
        public string SectionName { get; set; }
        public string ColumnName { get; set; }
        public List<BalanceSummary> Balances { get; set; }
    }
}