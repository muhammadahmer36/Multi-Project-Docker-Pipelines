using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.Modules.Balances.Entities;
using EcotimeMobileAPI.Modules.Balances.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BalancesController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor

        private readonly ILogger _logger;
        private readonly IBalancesRepository _repository;
        private readonly IGetAppMessageCache _appMessageCache;

        public BalancesController(IBalancesRepository repository, ILogger<BalancesController> logger, IAppMessagesRepository appMessagesRepository)
        {
            _logger = logger;
            _repository = repository;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Gets balance summary information.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="asOfDate"></param>
        [HttpGet, Route("Summary")]
        public async Task<ActionResult<ApiResponseModel<BalanceSummaryResponse>>> GetBalanceSummaryInfo([FromQuery] int resourceId,
                                                                          [FromQuery] string employeeNumber,
                                                                          [FromQuery] DateTime? asOfDate)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                var balances = await Task.Run(() => _repository.GetBalanceSummaryInfo(userAccountID, resourceId, employeeNumber, asOfDate));

                if (balances.BalanceSummary is null)
                {
                    return new ApiResponseModel<BalanceSummaryResponse>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.NoAccesForRequestedResource)
                    };
                }
                var groupedBalances = balances.BalanceSummary
                    .GroupBy(b => new { b.SectionName, b.ColumnName })
                    .Select(g => new GroupedBalance
                    {
                        SectionName = g.Key.SectionName,
                        ColumnName = g.Key.ColumnName,
                        Balances = g.Select(b => new BalanceSummary { 
                            Category = b.Category,
                            Hours = b.Hours,
                            BalanceGroupId = b.BalanceGroupId,
                            EmpNum = b.EmpNum,
                        }).ToList()
                    })
                    .ToList();
                balances.GroupedBalance = groupedBalances;

                return new ApiResponseModel<BalanceSummaryResponse>
                {
                    IsSuccessfull = true,
                    Data = balances
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetBalanceSummaryInfo() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Gets balance manager summary information.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="searchname"></param>
        /// <param name="balanceGroupId"></param>
        /// <param name="pageid"></param>
        /// <param name="asOfDate"></param>
        [HttpGet, Route("GetBalanceInfoManager")]
        public async Task<ActionResult<ApiResponseModel<BalanceSummaryResponse>>> GetBalanceInfoManager([FromQuery] int balanceGroupId, 
                                                                                                      [FromQuery] int pageid,
                                                                                                      [FromQuery] string searchname,
                                                                                                      [FromQuery] int resourceId,
                                                                                                      [FromQuery] DateTime? asOfDate)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                var balances = await Task.Run(() => _repository.GetBalanceInfoManager(userAccountID, balanceGroupId, pageid, searchname, resourceId, asOfDate));

                if (balances.BalanceSummary is null)
                {
                    return new ApiResponseModel<BalanceSummaryResponse>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.NoAccesForRequestedResource)
                    };
                }
                var groupedBalances = balances.BalanceSummary
                    .GroupBy(b => new { b.SectionName, b.ColumnName })
                    .Select(g => new GroupedBalance
                    {
                        SectionName = g.Key.SectionName,
                        ColumnName = g.Key.ColumnName,
                        Balances = g.Select(b => new BalanceSummary
                        {
                            Category = b.Category,
                            Hours = b.Hours,
                            BalanceGroupId = b.BalanceGroupId,
                            EmpNum = b.EmpNum,
                        }).ToList()
                    })
                    .ToList();
                balances.GroupedBalance = groupedBalances;

                return new ApiResponseModel<BalanceSummaryResponse>
                {
                    IsSuccessfull = true,
                    Data = balances
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetBalanceSummaryInfo() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }


        /// <summary>
        /// Gets balance category summary and details information.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="balanceGroupId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="asOfDate"></param>
        [HttpGet, Route("Categories")]
        public async Task<ActionResult<ApiResponseModel<BalanceDetailsResponse>>> GetBalanceDetailsInfo([FromQuery] int resourceId,
                                                                          [FromQuery] int balanceGroupId,
                                                                          [FromQuery] string employeeNumber,
                                                                          [FromQuery] DateTime? asOfDate)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                var balanceDetails = await Task.Run(() => _repository.GetBalanceDetailsInfo(userAccountID, resourceId, balanceGroupId, employeeNumber, asOfDate));

                if (balanceDetails.BalanceGroupSummary is null)
                {
                    return new ApiResponseModel<BalanceDetailsResponse>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.NoAccesForRequestedResource)
                    };
                }

                return new ApiResponseModel<BalanceDetailsResponse>
                {
                    IsSuccessfull = true,
                    Data = balanceDetails
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetBalanceDetailsInfo() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        #endregion
    }
}