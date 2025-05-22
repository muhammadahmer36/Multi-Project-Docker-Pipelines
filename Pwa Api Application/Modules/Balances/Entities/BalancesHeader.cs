using System;

namespace EcotimeMobileAPI.Modules.Balances.Entities
{
    public class BalancesHeader
    {
        public string TableTitle { get; set; }

        public DateTime CalculatedAsOfDate { get; set; }
    }
}