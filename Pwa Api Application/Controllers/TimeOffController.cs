using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EcotimeMobileAPI.Libraries;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.TimeOff.Entities;
using EcotimeMobileAPI.Modules.TimeOff.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;


namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeOffController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor
        
        private readonly ILogger _logger;
        private readonly ITimeOffRepository _repository;
        private readonly IGetAppMessageCache _appMessageCache;

        public TimeOffController(ITimeOffRepository repository, ILogger<TimeOffController> logger , IAppMessagesRepository appMessagesRepository)
        {
            _repository = repository;
            _logger = logger;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Gets timeoff information for the summary screen.
        /// </summary>
        [HttpPost, Route("Get")]
        public async Task<ActionResult<ApiResponseModel<TimeOffResponse>>> GetTimeOffInformation([FromBody] TimeOffGetRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Time Off info for userAccountID = '{userAccountID}', resourceId = {request.ResourceId}");
                request.ManagerMode = request.ManagerMode.HasValue ? request.ManagerMode : false;
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;

                var item = await Task.Run(() => _repository.GetTimeOff(userAccountID, request));

                return Ok(new ApiResponseModel<TimeOffResponse>
                {
                    Validation = item.ValidationResponse,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimeOffInformation() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves information to populate the details screen for a timeoff request.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="requestId"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="listOfPayCodeIds"></param>
        /// <param name="employeeNumber"></param>
        /// <param name="separator"></param>
        [HttpGet, Route("GetTimeOffDetails")]
        public async Task<ActionResult<ApiResponseModel<RequestDetailsResponse>>> GetRequestDetails([FromQuery] int resourceId,
                                                                      [FromQuery] int? requestId,
                                                                      [FromQuery] DateTime? startDate,
                                                                      [FromQuery] DateTime? endDate,
                                                                      [FromQuery] string listOfPayCodeIds,
                                                                      [FromQuery] string employeeNumber,
                                                                      [FromQuery] string separator)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Gets details info for timeoff request for userAccountID = '{userAccountID}'");
                requestId = requestId.HasValue? requestId : 0;
                separator = string.IsNullOrEmpty(separator) ? "|" : separator;

                var item = await Task.Run(() => _repository.GetRequestDetails(userAccountID, resourceId, requestId, startDate, endDate, listOfPayCodeIds, employeeNumber, separator));

                return Ok(new ApiResponseModel<RequestDetailsResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetRequestDetails() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Executes an action (Approve, Deny, Delete, etc).
        /// </summary>
        [HttpPost, Route("ExecuteAction")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> ExecuteAction([FromBody] ExecuteActionRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Execute TimeOff Action for userAccountID = '{userAccountID}'");
                request.ManagerMode = request.ManagerMode.HasValue? request.ManagerMode: false;
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;

                var item = await Task.Run(() => _repository.ExecuteAction(userAccountID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    Validation = item,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"ExecuteAction() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves information to populate the Add New Request screen.
        /// </summary>
        /// <param name="resourceId"></param>
        [HttpGet, Route("NewRequestSummary")]
        public async Task<ActionResult<ApiResponseModel<NewRequestResponse>>> AddNewRequest([FromQuery] int resourceId)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Gets info for new timeoff request for userAccountID = '{userAccountID}'");

                var item = await Task.Run(() => _repository.AddNewRequest(userAccountID, resourceId));

                return Ok(new ApiResponseModel<NewRequestResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"AddNewRequest() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Saves timeoff request data.
        /// </summary>
        [HttpPost, Route("Save")]
        public async Task<ActionResult<ApiResponseModel<TimeOffSaveResponse>>> SaveTimeOffRequests([FromBody] SaveTimeOffDataRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Save TimeOff Data for userAccountID = '{userAccountID}'");
                request.RequestId = request.RequestId.HasValue? request.RequestId: 0;
                request.Separator = string.IsNullOrEmpty(request.Separator) ? "|" : request.Separator;

                var item = await Task.Run(() => _repository.SaveTimeOffRequests(userAccountID, request));

                return Ok(new ApiResponseModel<TimeOffSaveResponse>
                {
                    Validation = new ValidationResponse { 
                        StatusCode = item.StatusCode, 
                        StatusMessage = item.StatusMessage,
                    },
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveTimeOffRequests() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets timeoff notes for a particular request.
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="requestId"></param>
        [HttpGet, Route("Notes")]
        public async Task<ActionResult<ApiResponseModel<TimeOffNotesResponse>>> GetTimeOffNotes([FromQuery] int resourceId, [FromQuery] int requestId)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Time Off notes for userAccountID = '{userAccountID}', resourceId = '{resourceId}', requestId = '{requestId}'");

                var item = await Task.Run(() => _repository.GetTimeOffNotes(userAccountID, resourceId, requestId));

                return Ok(new ApiResponseModel<TimeOffNotesResponse>
                {
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetTimeOffNotes() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Adds a note to a timeoff request.
        /// </summary>
        [HttpPost, Route("AddNote")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> AddTimeOffNote([FromBody] AddTimeOffNoteRequest request)
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Add a timeOff request note for userAccountID = '{userAccountID}', requestId = '{request.RequestId}'");

                if (request.Note.Length > 500)
                {
                    ValidationResponse validationresponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.NoteCharactersLimitValidation);
                    validationresponse.StatusMessage = validationresponse.StatusMessage.Replace("%s", "500");
                    return Ok(new ApiResponseModel<ValidationResponse>
                    {
                        Validation = validationresponse,
                        IsSuccessfull = false,
                        Data = null
                    });
                }

                var item = await Task.Run(() => _repository.AddTimeOffNote(userAccountID, request));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    Validation = item,
                    IsSuccessfull = true,
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"AddTimeOffNote() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        #endregion
    }
}