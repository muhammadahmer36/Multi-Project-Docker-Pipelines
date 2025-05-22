using Dapper;
using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Balances.Contexts;
using EcotimeMobileAPI.Modules.Balances.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.Balances.Repositories
{
    public class BalancesRepository : StoredProcRepository, IBalancesRepository
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public BalancesRepository(BalancesContext dbContext,
            IConfiguration config,
            ILogger<BalancesRepository> logger) :
            base(dbContext)
        {
            _config = config;
            _logger = logger;
            _connectionString = _config.GetConnectionString("HBSData");
        }

        public BalanceSummaryResponse GetBalanceSummaryInfo(int userAccountID,int resourceId, string employeeNumber,  DateTime? asOfDate)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();


                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_useraccountid", userAccountID);
                parameters.Add("in_resourceid", resourceId);
                parameters.Add("in_asofdate", asOfDate);
                parameters.Add("in_employeenumber", employeeNumber);

                using var multipleQueryResult = connection.QueryMultiple("[dbo].[Balances_Get]", parameters, commandType: CommandType.StoredProcedure);

                return new BalanceSummaryResponse
                {
                    ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                    ResourceInfo    = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                    HeaderInfo = multipleQueryResult.MapToSingle<BalancesHeader>(),
                    BalanceSummary  = multipleQueryResult.MapToList<BalanceSummary>()
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public BalanceDetailsResponse GetBalanceDetailsInfo(int userAccountID, int resourceId, int balanceGroupId, string employeeNumber, DateTime? asOfDate)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_useraccountid", userAccountID);
                parameters.Add("in_resourceid", resourceId);
                parameters.Add("in_asofdate", asOfDate);
                parameters.Add("in_employeenumber", employeeNumber);
                parameters.Add("in_balancegroupid", balanceGroupId);

                using var multipleQueryResult = connection.QueryMultiple("[dbo].[Balances_Get]", parameters, commandType: CommandType.StoredProcedure);

                return new BalanceDetailsResponse
                {
                    ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                    ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                    HeaderInfo = multipleQueryResult.MapToSingle<BalancesHeader>(),
                    BalanceGroupSummary = multipleQueryResult.MapToList<BalanceGroupSummary>(),
                    BalanceGroupDetails = multipleQueryResult.MapToList<BalanceGroupDetails>()
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public BalanceSummaryResponse GetBalanceInfoManager(int userAccountID, int balanceGroupId, int pageid, string searchname, int resourceId, DateTime? asOfDate)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();


                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_useraccountid", userAccountID);
                parameters.Add("in_balancegroupid", balanceGroupId);
                parameters.Add("in_pageid", pageid);
                parameters.Add("in_searchname", searchname);
                parameters.Add("in_resourceid", resourceId);
                parameters.Add("in_asofdate", asOfDate);

                using var multipleQueryResult = connection.QueryMultiple("[dbo].[Balances_Get_Manager]", parameters, commandType: CommandType.StoredProcedure);

                return new BalanceSummaryResponse
                {
                    ApplicationInfo = multipleQueryResult.MapToSingle<ApplicationInfo>(),
                    ResourceInfo = multipleQueryResult.MapToSingle<CommonResourceInfo>(),
                    HeaderInfo = multipleQueryResult.MapToSingle<BalancesHeader>(),
                    BalanceSummary = multipleQueryResult.MapToList<BalanceSummary>(),
                    BalancesParam = multipleQueryResult.MapToSingle<BalancesParams>()
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}