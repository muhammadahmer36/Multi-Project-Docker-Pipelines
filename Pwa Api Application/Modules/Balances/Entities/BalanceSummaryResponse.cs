using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Balances.Entities
{
    public class BalanceSummaryResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public BalancesHeader HeaderInfo { get; set; }
        internal IList<BalanceSummary> BalanceSummary { get; set; }
        public IList<GroupedBalance> GroupedBalance { get; set; }
        public BalancesParams BalancesParam { get; set; }
    }
}