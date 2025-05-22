using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.Modules.Common.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor

        private readonly ICommonRepository _repository;
        private readonly ILogger _logger;

        public CommonController(ICommonRepository repository, ILogger<CommonController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Gets employee search results for autocomplete operation.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="searchString"></param>
        /// <param name="periodIdentity"></param>
        /// <param name="searchByMode"></param>
        [HttpGet, Route("EmployeeSearchResults")]
        public async Task<ActionResult<ApiResponseModel<EmployeeSearchResponse>>> GetEmployeeSearchResults([FromQuery] int resourceId, [FromQuery] string searchString, [FromQuery] int? periodIdentity, [FromQuery] int? searchByMode)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Employee Search Results for userAccountID = '{userAccountID}', resourceId = {resourceId}, searchString = '{searchString}'");

                var item = await Task.Run(() => _repository.GetEmployeeSearchResults(userAccountID, resourceId, searchString, periodIdentity, searchByMode));
                return Ok(new ApiResponseModel<EmployeeSearchResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetEmployeeSearchResults() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Returns data for timesheet group drop down.
        /// </summary>
        [HttpGet, Route("TimesheetGroups")]
        public async Task<ActionResult<ApiResponseModel<TSGroupResponse>>> GetTimesheetGroupsInfo([FromQuery] int resourceId)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Timesheet Groups Data for userAccountID = '{userAccountID}'");

                var item = await Task.Run(() => _repository.GetTimesheetGroupsInfo(userAccountID, resourceId));

                var itemToRemove = item.TimesheetGroups.FirstOrDefault(x => x.GroupId == 0);
                if (itemToRemove != null)
                    item.TimesheetGroups.Remove(itemToRemove);
                return Ok(new ApiResponseModel<TSGroupResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetGroupsInfo() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        #endregion
    }
}