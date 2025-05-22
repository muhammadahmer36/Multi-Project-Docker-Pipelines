using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Notification.Entities;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Notification.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {

        private readonly ILogger _logger;
        private readonly IGetAppMessageCache _appMessageCache;
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(ILogger<TimeOffController> logger, IAppMessagesRepository appMessagesRepository, INotificationRepository notificationRepository)
        {
            _logger = logger;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
            _notificationRepository = notificationRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseModel<NotificationList>>> getNotification([Required] string employeeNumber)
        {   
            try
            {
                NotificationList notifications = await _notificationRepository.GetNotificationAsync(employeeNumber);

                return Ok(new ApiResponseModel<NotificationList>
                {
                    IsSuccessfull = true,
                    Data = notifications
                });
            }

            catch (Exception ex)
            {
                _logger.LogError($"GetTimesheetConfiguration() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }

        }

    }
}
