using System;
using EcotimeMobileAPI.Modules.Balances.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.Balances.Repositories
{
    public interface IBalancesRepository : IStoredProcRepository
    {
        BalanceSummaryResponse GetBalanceSummaryInfo(int userAccountID, int resourceId, string employeeNumber, DateTime? asOfDate);
        BalanceDetailsResponse GetBalanceDetailsInfo(int userAccountID, int resourceId, int balanceGroupId, string employeeNumber, DateTime? asOfDate);
        BalanceSummaryResponse GetBalanceInfoManager(int userAccountID, int balanceGroupId, int pageid, string searchname, int resourceId, DateTime? asOfDate);
    }
}