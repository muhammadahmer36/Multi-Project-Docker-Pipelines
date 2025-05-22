using System;
using System.Linq;
using System.Data.Common;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.TimePunches.Entities;
using EcotimeMobileAPI.Modules.TimePunches.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using Microsoft.AspNetCore.Cors;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimePunchesController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor

        private readonly ILogger _logger;
        private readonly IEmailService _emailService;
        private readonly ITimePunchesRepository _repository;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IGetAppMessageCache _appMessageCache;

        public TimePunchesController(ITimePunchesRepository repository, ILogger<TimePunchesController> logger
            , IAppMessagesRepository appMessagesRepository, IEmailService emailService, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _repository = repository;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
            _emailService = emailService;   
            _hostEnvironment = hostEnvironment;
        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Gets punch time information based on {resourceId} , {historyDate} , {historyEndDate} and {timeZoneOffset}.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="historyDate"></param>
        /// <param name="historyEndDate"></param>
        /// <param name="timeZoneOffset"></param>
        [HttpGet, Route("Get")]
        public async Task<ActionResult<ApiResponseModel<WebClockResponse>>> GetPunchTimeInfo([FromQuery] int resourceId, [FromQuery] DateTime? historyDate, [FromQuery] DateTime? historyEndDate, [FromQuery, Required] decimal timeZoneOffset)
        {
            try
            {
                WebClockResponse webClockResponse = new WebClockResponse();

                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get PunchTimeInfo for userAccountID = '{userAccountID}', resourceId = {resourceId}, historyDate = {historyDate}, historyEndDate = {historyEndDate}, timeZoneOffset = {timeZoneOffset}");
                var item = await Task.Run(() => _repository.GetHistory(userAccountID, resourceId, historyDate, historyEndDate,timeZoneOffset));


                return Ok(new ApiResponseModel<WebClockResponse>
                {
                    Validation = item.ValidationResponse,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetPunchTimeInfo() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets Clock Widget configuration data.
        /// </summary>
        [HttpGet, Route("ClockWidgetConfig")]
        public async Task<ActionResult<ApiResponseModel<ClockWidgetResponse>>> GetClockWidgetConfigurationDataAsync()
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Clock Widget configuration data for userAccountID = '{userAccountID}'");
                var clockWidgetItem =  await Task.Run(() => _repository.GetClockWidgetConfigurationData(userAccountID));
                return Ok(new ApiResponseModel<ClockWidgetResponse>
                {
                    IsSuccessfull = true,
                    Data = clockWidgetItem,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetClockWidgetConfigurationData() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Gets GetAdditionalInfo data.
        /// </summary>
        [HttpGet, Route("GetAdditionalInfo")]
        public async Task<ActionResult<ApiResponseModel<Dictionary<int, AdditionalInfoResponse>>>> GetAdditionalInfo()
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get GetAdditionalInfo data for userAccountID = '{userAccountID}'");
                var allAdditionalInfo = await Task.Run(() => _repository.GetAllAdditionalInfo(userAccountID));

                Dictionary<int, AdditionalInfoResponse> data = new Dictionary<int, AdditionalInfoResponse>();
                int[] distinctFunctionids = allAdditionalInfo.PunchDetails.Select(x => x.FunctionId).Distinct().ToArray();
                for (int i = 0; i < distinctFunctionids.Length; i++)
                {
                    data.Add(distinctFunctionids[i], new AdditionalInfoResponse
                    {
                        PunchDetails = allAdditionalInfo.PunchDetails.Where(pd => pd.FunctionId == distinctFunctionids[i]).ToList(),
                        PunchTasksList = allAdditionalInfo.PunchTasksList.Where(ptl => ptl.FunctionId == distinctFunctionids[i]).ToList()
                    });
                }
                return new ApiResponseModel<Dictionary<int, AdditionalInfoResponse>>
                {
                    IsSuccessfull = true,
                    Data = data,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetAdditionalInfo() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Gets punch time history for {historyDate}.
        /// </summary>
        /// <param name="historyDate"></param>
        [HttpGet, Route("PunchHistory")]
        public ActionResult<PunchHistoryResponse> GetPunchTimeHistory([FromQuery] DateTime? historyDate)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get PunchTime History for userAccountID = '{userAccountID}', historyDate = {historyDate}");

                PunchHistoryResponse item = new PunchHistoryResponse();

                using DbCommand command = _repository.GetStoredProcedure("[dbo].[PunchTimeHistory_Get]")
                    .WithSqlParams
                        (("in_useraccountid", userAccountID),
                        ("in_date", historyDate));

                if (command.Connection.State == System.Data.ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using DbDataReader reader = command.ExecuteReader();

                    item.WebClockInfo = reader.MapToSingle<WebClockInfo>();
                    item.PunchHistory = reader.MapToList<PunchHistoryItem>();
                }
                finally
                {
                    command.Connection.Close();
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetPunchTimeHistory() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets search results for autocomplete operation.
        /// </summary>
        /// <param name="fieldId"></param>
        /// /// <param name="searchString"></param>
        [HttpGet, Route("AutoCompleteResults")]
        public ActionResult<TSSearchResultResponse> GetSearchResults([FromQuery] int fieldId, [FromQuery] string searchString)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Search Results for userAccountID = '{userAccountID}', fieldId = {fieldId}, searchString = '{searchString}'");

                TSSearchResultResponse item = new TSSearchResultResponse();

                using DbCommand command = _repository.GetStoredProcedure("[dbo].[PunchTimeAutocomplete_Get]")
                    .WithSqlParams
                        (("in_useraccountid", userAccountID),
                         ("in_fieldid", fieldId),
                         ("in_searchstring", searchString));

                if (command.Connection.State == System.Data.ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using DbDataReader reader = command.ExecuteReader();
                    item.SearchResults = reader.MapToList<DropDownIntItem>();
                    return Ok(item);
                }
                finally
                {
                    command.Connection.Close();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetSearchResults() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Inserts a new time punch.
        /// </summary>

        [HttpPost, Route("AddPunch")]
        public async Task<ActionResult<ApiResponseModel<ClockWidgetResponse>>> InsertTimePunch([FromBody] NewTimePunchRequest request)
        {
                
            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
            string deviceName = Misc.GetDeviceName(Request.Headers["Authorization"]);
                
            try
            {
                _logger.LogInformation($"Insert new Time Punch for userAccountID = '{userAccountID}'");

                PunchAdditionalInfo timePunchingResponse = await _repository.InsertTimePunchingAsync(request, userAccountID, deviceName);

                if (timePunchingResponse.ValidationResponse.StatusCode is (int) eErrorMessageCode.NoAccesForTimePunching)
                {
                    return new ApiResponseModel<ClockWidgetResponse> 
                    { 
                        Validation = timePunchingResponse.ValidationResponse 
                    };
                }

                if (timePunchingResponse.ValidationResponse.StatusCode == 0) timePunchingResponse.ValidationResponse.StatusCode = (int)eErrorMessageCode.TimePunchingIsCreated;
               
                var data = await Task.Run(() => _repository.GetClockWidgetConfigurationData(userAccountID));
                data.PunchAdditionalInfo = timePunchingResponse;

                return new ApiResponseModel<ClockWidgetResponse>
                {
                    Validation = timePunchingResponse.ValidationResponse,
                    Data = data,
                    IsSuccessfull = timePunchingResponse.ValidationResponse.StatusCode is (int)eErrorMessageCode.TimePunchingIsCreated
                }; 
            }
            catch (Exception ex)
            {
                _logger.LogError($"inserttimepunch() encountered fatal database error => {ex.Message}");

                ValidationResponse validationresponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.TimePunchingFailed);

                validationresponse.StatusMessage =
                    string.Format(validationresponse.StatusMessage, request.UtcTimestamp.AddHours((double)request.TimeZoneOffset).ToString("hh:mm tt"));

                _ = Task.Run(() =>
                {

                    string completepath = $"{_hostEnvironment.ContentRootPath}{Constants.EmailTemplatePathForPunchActivityFailure}";
                    string emailhtmltemplate = Misc.GetTemplateBody(completepath);
                    string emailcontent = emailhtmltemplate.FormatHtml(validationresponse.StatusMessage, userAccountID, deviceName
                                        , ((ePunchType)request.FunctionId).ToString(), ex.Message, ex.StackTrace, request.TimeZoneOffset);

                    EmailMessage msg = new EmailMessage
                    {
                        Subject = Constants.SubjectForPunchActivityFailure,
                        Content = emailcontent
                    };

                    _emailService.SendEmailToSupport(msg);
                });
                
                return new ApiResponseModel<ClockWidgetResponse>
                {
                    HttpStatusCode = System.Net.HttpStatusCode.InternalServerError,
                    Validation = validationresponse,
                };
            }
        }

        /// <summary>
        /// Updates a time punch with additional information.
        /// </summary>
        [HttpPost, Route("UpdatePunch")]
        public async Task<ActionResult<ValidationResponse>> UpdateTimePunch([FromBody] UpdateTimePunchRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Update Time Punch for userAccountID = '{userAccountID}'");

                return await _repository.UpdateTimePunchAsync(request, userAccountID); 
            }
            catch (Exception ex)
            {
                _logger.LogError($"UpdateTimePunch() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }
        #endregion
    }
}