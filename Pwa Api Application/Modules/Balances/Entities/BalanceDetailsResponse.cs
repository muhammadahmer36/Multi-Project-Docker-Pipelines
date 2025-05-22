using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Balances.Entities
{
    public class BalanceDetailsResponse
    {
        public ApplicationInfo ApplicationInfo { get; set; }
        public CommonResourceInfo ResourceInfo { get; set; }
        public BalancesHeader HeaderInfo { get; set; }
        public IList<BalanceGroupSummary> BalanceGroupSummary { get; set; }
        public IList<BalanceGroupDetails> BalanceGroupDetails { get; set; }
    }
}