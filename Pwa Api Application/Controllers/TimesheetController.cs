using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EcotimeMobileAPI.Libraries;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Entities;
using EcotimeMobileAPI.Modules.Timesheet.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimesheetController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor

        private readonly IGetAppMessageCache _appMessageCache;
        private readonly ITimesheetRepository _repository;
        private readonly ILogger _logger;

        public TimesheetController(ITimesheetRepository repository, ILogger<TimesheetController> logger, IAppMessagesRepository appMessagesRepository)
        {
            _repository = repository;
            _logger = logger;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Gets timesheet information for an employee, pay period and view type.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        [HttpGet, Route("Get")]
        public async Task<ActionResult<ApiResponseModel<TimesheetResponse>>> GetTimesheet([FromQuery] int resourceId,
                                                            [FromQuery] string employeeNumber,
                                                            [FromQuery] int? periodIdentity)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                periodIdentity = periodIdentity.HasValue ? periodIdentity : 0;
                _logger.LogInformation($"Get Timesheet info for userAccountID = '{userAccountID}', resourceId = {resourceId}");
                var item = await Task.Run(() => _repository.Get(userAccountID, resourceId, employeeNumber, 4, periodIdentity));

                return Ok(new ApiResponseModel<TimesheetResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheet() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets timesheet information for a pay period.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        [HttpGet, Route("GetByPayPeriod")]
        public async Task<ActionResult<ApiResponseModel<TSPayPeriodResponse>>> GetTimesheetByPayPeriod([FromQuery] int resourceId,
                                                                         [FromQuery] string employeeNumber,
                                                                         [FromQuery] int? periodIdentity)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                periodIdentity = periodIdentity.HasValue ? periodIdentity : 0;
                _logger.LogInformation($"Get Timesheet by Pay Period info for userAccountID = '{userAccountID}', resourceId = {resourceId}");

                var item = await Task.Run(() => _repository.GetTimesheetByPayPeriod(userAccountID, resourceId, employeeNumber, 0, periodIdentity));

                return Ok(new ApiResponseModel<TSPayPeriodResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetByPayPeriod() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets weekly timesheet information for a pay period.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        [HttpGet, Route("GetByWeeks")]
        public async Task<ActionResult<ApiResponseModel<TSWeeklyResponse>>> GetTimesheetByWeeks([FromQuery] int resourceId,
                                                                  [FromQuery] string employeeNumber,
                                                                  [FromQuery] int? periodIdentity)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                periodIdentity = periodIdentity.HasValue ? periodIdentity : 0;
                _logger.LogInformation($"Get Timesheet by Weeks info for userAccountID = '{userAccountID}', resourceId = {resourceId}");

                var item = await Task.Run(() => _repository.GetTimesheetByWeeks(userAccountID, resourceId, employeeNumber, 1, periodIdentity));

                return Ok(new ApiResponseModel<TSWeeklyResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetByWeeks() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets daily timesheet information for a pay period.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        [HttpGet, Route("GetByDays")]
        public async Task<ActionResult<ApiResponseModel<TSDailyResponse>>> GetTimesheetByDays([FromQuery] int resourceId,
                                                        [FromQuery] string employeeNumber,
                                                        [FromQuery] int? periodIdentity)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                periodIdentity = periodIdentity.HasValue ? periodIdentity : 0;
                _logger.LogInformation($"Get Timesheet by Days info for userAccountID = '{userAccountID}', resourceId = {resourceId}");

                var item = await Task.Run(() => _repository.GetTimesheetByDays(userAccountID, resourceId, employeeNumber, 2, periodIdentity));
                LinkDailyHeadersAndDetails(item, item.ItemDetails);

                return Ok(new ApiResponseModel<TSDailyResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetByWeeks() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets timesheet Certify Uncertifyinformation for an employee.
        /// </summary>
        /// <param name="date"></param>
        [HttpGet, Route("GetCertifyUncertify")]
        public async Task<ActionResult<ApiResponseModel<TimesheetCertifyUncertifyResponse>>> GetCertifyUncertifyTimesheet([FromQuery] DateTime? date)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get GetCertifyUncertify info for userAccountID = '{userAccountID}'");
                var item = await Task.Run(() => _repository.GetCertifyUncertifyTimesheet(userAccountID, date));

                return Ok(new ApiResponseModel<TimesheetCertifyUncertifyResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetCertifyUncertify() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets employees timesheet information for a manager to review.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="periodIdentity"></param>
        /// <param name="listOfEmployeeNumbers"></param>
        /// <param name="separator"></param>
        [HttpGet, Route("ManagerReviewInfo")]
        public async Task<ActionResult<ApiResponseModel<TSManagerInfoResponse>>> GetTimesheetInfoForManager([FromQuery] int resourceId,
                                                                              [FromQuery] int? periodIdentity,
                                                                              [FromQuery] string listOfEmployeeNumbers,
                                                                              [FromQuery] string separator)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Timesheet info for manager for userAccountID = '{userAccountID}', resourceId = {resourceId}");
                var item = await Task.Run(() => _repository.GetTimesheetInfoForManager(userAccountID, resourceId, periodIdentity, listOfEmployeeNumbers, separator));

                return Ok(new ApiResponseModel<TSManagerInfoResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetInfoForManager() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets timesheet notes information for a pay period.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        [HttpGet, Route("GetNotes")]
        public async Task<ActionResult<ApiResponseModel<TSNotesResponse>>> GetTimesheetNotes([FromQuery] int resourceId,
                                                               [FromQuery] string employeeNumber,
                                                               [FromQuery] int? periodIdentity)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                periodIdentity = periodIdentity.HasValue ? periodIdentity : 0;
                _logger.LogInformation($"Get Timesheet notes info for userAccountID = '{userAccountID}', resourceId = {resourceId}");
                var item = await Task.Run(() => _repository.GetTimesheetNotes(userAccountID, resourceId, employeeNumber, 3, periodIdentity));

                return Ok(new ApiResponseModel<TSNotesResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetNotes() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Executes an action (Complete/UnComplete, Approve/UnApprove, Calculate).
        /// </summary>
        [HttpPost, Route("ExecuteTSAction")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> ExecuteTSAction([FromBody] ExecuteTSActionRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                string deviceID = Misc.GetDeviceID(Request.Headers["Authorization"]);
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                _logger.LogInformation($"Execute Timesheet Action for userAccountID = '{userAccountID}'");

                var item = await Task.Run(() => _repository.ExecuteTSAction(userAccountID, deviceID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    Validation = item,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"ExecuteTSAction() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Adds a new timesheet note.
        /// </summary>
        [HttpPost, Route("AddNote")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> AddTSNote([FromBody] AddTSNoteRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Execute Add TS Note for userAccountID = '{userAccountID}'");
                
                if (request.Note.Length > 2000)
                {
                    ValidationResponse validationresponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.NoteCharactersLimitValidation);
                    validationresponse.StatusMessage = validationresponse.StatusMessage.Replace("%s", "2000");
                    return Ok(new ApiResponseModel<ValidationResponse>
                    {
                        Validation = validationresponse,
                        IsSuccessfull = false,
                        Data = null
                    });
                }
                
                var item = await Task.Run(() => _repository.AddTSNote(userAccountID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    Validation = item,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"AddTSNote() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets configuration data needed to construct timesheet entry screens.
        /// </summary>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        /// <param name="tsDate"></param>
        /// <param name="section"></param>
        [HttpGet, Route("Configuration")]
        public async Task<ActionResult<ApiResponseModel<TSConfigurationResponse>>> GetTimesheetConfiguration([FromQuery] string employeeNumber,
                                                                               [FromQuery] int periodIdentity,
                                                                               [FromQuery] DateTime? tsDate,
                                                                               [FromQuery] int? section)
        {
            try
            {
                _logger.LogInformation($"Get Timesheet configuration for employeeNumber = '{employeeNumber}'");
                section = section.HasValue ? section : 3;
                var item = await Task.Run(() => _repository.GetTimesheetConfiguration(employeeNumber, periodIdentity, tsDate, section));

                return Ok(new ApiResponseModel<TSConfigurationResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetConfiguration() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Returns data for timesheet search page.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="groupId"></param>
        [HttpGet, Route("TimesheetSearchParams")]
        public async Task<ActionResult<ApiResponseModel<TSSearchDataResponse>>> GetTimesheetSearchParamsInfo([FromQuery] int resourceId, [FromQuery] int groupId)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Timesheet Search Params Data for userAccountID = '{userAccountID}', resourceId = {resourceId}");

                var item = await Task.Run(() => _repository.GetTimesheetSearchParamsInfo(userAccountID, resourceId, groupId));

                return Ok(new ApiResponseModel<TSSearchDataResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetSearchParamsInfo() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets timesheet data for requested employees and pay period (Manager Mode Only).
        /// </summary>
        [HttpPost, Route("TimesheetSearchResult")]
        public async Task<ActionResult<ApiResponseModel<TSEmpSearchResultResponse>>> GetTimesheetSearchResultData([FromBody] TimesheetSearchResultRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Timesheet search result for manager for requested employees and pay period");
                request.PeriodIdentity = request.PeriodIdentity.HasValue ? request.PeriodIdentity : 0;
                request.StatusCodesCondition = string.IsNullOrEmpty(request.StatusCodesCondition) ? "OR" : request.StatusCodesCondition;
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                if (!string.IsNullOrEmpty(request.GroupId))
                {
                    var empList = await Task.Run(() => _repository.GetTimesheetGroupUsers(userAccountID, request.GroupId, request));
                    TSEmpSearchResultResponse item = new TSEmpSearchResultResponse();
                    item.ApplicationInfo = empList.ApplicationInfo;
                    item.ResourceInfo = empList.ResourceInfo;
                    item.PayPeriod = empList.PayPeriod;
                    item.Actions = empList.Actions;
                    var employeeDetails = new List<TSEmployeeDetailsItem>();
                    foreach (var emp in empList?.EmployeeList)
                    {
                        TSEmployeeDetailsItem tsEmployeeDetailsItem = new TSEmployeeDetailsItem
                        {
                            EmpNo = emp.EmpNo,
                            EmployeeName = emp.EmployeeName,
                            CompleteStatus_Code = emp.Completed == 1 ? true : false,
                            CompleteStatus_Title = emp.Completed == 1 ? "Completed" : "UnCompleted",
                            CompleteStatus_Color = emp.Completed == 1 ? "#67971A" : "#FD9927",
                            ApproveStatus_Code = emp.Approved == 1 ? true : false,
                            ApproveStatus_Title = emp.Approved == 1 ? "Approved" : "NotApproved",
                            ApproveStatus_Color = emp.Approved == 1 ? "#67971A" : "#FD9927",
                            Duration_Display = "0.00 - Reported<br/>0.00 - Calculated",
                            NotesCount = emp.NumNotes,
                            ErrorCount = emp.NumErrors,
                            ErrorDescription = "",
                            Actions = "",
                        };
                        employeeDetails.Add(tsEmployeeDetailsItem);
                    }
                    item.EmployeeDetails = employeeDetails;
                    return Ok(new ApiResponseModel<TSEmpSearchResultResponse>
                    {
                        IsSuccessfull = true,
                        Data = item,
                    });

                } else
                {
                    var item = await Task.Run(() => _repository.GetTimesheetSearchResultData(userAccountID, request));

                    return Ok(new ApiResponseModel<TSEmpSearchResultResponse>
                    {
                        IsSuccessfull = true,
                        Data = item,
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetSearchResultData() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets search results for timesheet autocomplete operation.
        /// </summary>
        /// <param name="employeeNumber"></param>
        /// <param name="periodIdentity"></param>
        /// <param name="fieldIdToPopulate"></param>
        /// <param name="fieldIds"></param>
        /// <param name="fieldValues"></param>
        /// <param name="tsDate"></param>
        /// <param name="section"></param>
        /// <param name="separator"></param>
        [HttpGet, Route("AutoCompleteResults")]
        public async Task<ActionResult<ApiResponseModel<TSSearchResultResponse>>> GetTSSearchResults([FromQuery] string employeeNumber,
                                                                       [FromQuery] int periodIdentity,
                                                                       [FromQuery] int fieldIdToPopulate,
                                                                       [FromQuery] string fieldIds,
                                                                       [FromQuery] string fieldValues,
                                                                       [FromQuery] DateTime? tsDate,
                                                                       [FromQuery] int? section,
                                                                       [FromQuery] string separator)
        {
            try
            {
                _logger.LogInformation($"Get TS Search Results for employeeNumber = '{employeeNumber}'");
                section = section.HasValue? section : 3;
                separator = string.IsNullOrEmpty(separator) ? "|" : separator;
                var item = await Task.Run(() => _repository.GetTSSearchResults(employeeNumber, periodIdentity, fieldIdToPopulate, fieldIds, fieldValues, tsDate, section, separator));

                return Ok(new ApiResponseModel<TSSearchResultResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTSSearchResults() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Inserts a new Timesheet entry or updates an existing Timesheet entry.
        /// </summary>
        [HttpPost, Route("Save")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> SaveTimesheet([FromBody] SaveTSRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                string deviceID = Misc.GetDeviceID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Add/Edit Timesheet Entry for userAccountID = '{userAccountID}'");
                request.Id = request.Id.HasValue? request.Id: 0;
                request.Hours = request.Hours.HasValue? request.Hours: 0;
                request.Minutes = request.Minutes.HasValue? request.Minutes: 0;
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                var item = await Task.Run(() => _repository.SaveTimesheet(userAccountID, deviceID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveTimesheet() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Deletes timesheets by the week.
        /// </summary>
        [HttpPost, Route("DeleteByWeeks")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> DeleteTSByWeeks([FromBody] DeleteByWeeksRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                string deviceID = Misc.GetDeviceID(Request.Headers["Authorization"]);
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                _logger.LogInformation($"Delete Timesheet By Weeks for userAccountID = '{userAccountID}'");
                
                var item = await Task.Run(() => _repository.DeleteTSByWeeks(userAccountID, deviceID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"DeleteTSByWeeks() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Deletes timesheets by the day.
        /// </summary>
        [HttpPost, Route("DeleteByDays")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> DeleteTSByDays([FromBody] DeleteByDaysRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                string deviceID = Misc.GetDeviceID(Request.Headers["Authorization"]);
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                _logger.LogInformation($"Delete Timesheet By Days for userAccountID = '{userAccountID}'");
                
                var item = await Task.Run(() => _repository.DeleteTSByDays(userAccountID, deviceID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"DeleteTSByDays() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Deletes individual timesheet entries.
        /// </summary>
        [HttpPost, Route("DeleteEntries")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> DeleteTSEntries([FromBody] DeleteTSEntriesRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                string deviceID = Misc.GetDeviceID(Request.Headers["Authorization"]);
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;
                _logger.LogInformation($"Delete Individual Timesheet Entries for userAccountID = '{userAccountID}'");
                
                var item = await Task.Run(() => _repository.DeleteTSEntries(userAccountID, deviceID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"DeleteTSEntries() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        #endregion

        #region Private Helper Methods

        private void LinkDailyHeadersAndDetails(TSDailyResponse item, IList<TSDailyDetailItem> details)
        {
            foreach (TSDailyDetailItem det in details)
            {
                foreach (TSDailyHeaderItem header in item.DailyItems)
                {
                    if (header.WeekNum == det.WeekNum && header.TsDate == det.TsDate)
                    {
                        header.DailyDetails.Add(det.Clone());
                        break;
                    }
                }
            }
        }

        #endregion
    }
}