using System;
using System.Data.Common;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.Observers;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.Modules.Test.Entities;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Test.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.AlertControl.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        #region Private ReadOnly Variables & Constructor

        private readonly ITestRepo _repository;
        private readonly ILogger _logger;
        private readonly IdapperTest _idapperTest;
        private readonly IldapService _ldapService;
        private readonly IAppMessagesRepository _appMessagesRepository;
        private readonly IGetAppMessageCache _appMessageByIdRepository;

        public TestController(ITestRepo repository, ILogger<TestController> logger, IdapperTest idapperTest, IldapService ldapService
            , IAppMessagesRepository appMessagesRepository)
        {
            _logger = logger;
            _repository = repository;
            _idapperTest = idapperTest;
            _ldapService = ldapService;
            _appMessagesRepository = appMessagesRepository;
            _appMessageByIdRepository = appMessagesRepository as IGetAppMessageCache;
        }

        #endregion


        [HttpGet("DummyEndpoint"), AllowAnonymous]
        public ActionResult<string> DummyEndpoint()
        {
            return _repository.DummyEndPoint();
        }


        [HttpGet("TestCache"), AllowAnonymous]
        public ActionResult<IEnumerable<ValidationResponse>> TestCache()
        {
            return Ok(_appMessagesRepository.GetAllAppMessages());
        }

        [HttpGet("RefreshCache"), AllowAnonymous]
        public ActionResult<IEnumerable<ValidationResponse>> RefreshCache()
        {
           // _refreshCache.RefreshCache();
            var logger = HttpContext.RequestServices.GetService(typeof(ILogger<CacheRefreshObserver>)) as ILogger<CacheRefreshObserver>;
            var appMessagesCache = HttpContext.RequestServices.GetService(typeof(IAppMessagesRepository)) as AppMessagesCache;
            var passConfigCache = HttpContext.RequestServices.GetService(typeof(PasswordConfigurationCache)) as PasswordConfigurationCache;
            var alertControlCache = HttpContext.RequestServices.GetService(typeof(IAlertControlRepository)) as AlertControlCache;
            new CacheRefreshObserver(logger, appMessagesCache, passConfigCache, alertControlCache).LoadAllCache();
            return Ok("");
        }

        [HttpGet("GetAppMessageById"), AllowAnonymous]
        public ActionResult<ValidationResponse> GetAppMessageById(eErrorMessageCode errorMessageCode)
        {
            return Ok(_appMessageByIdRepository.GetAppMessageById(errorMessageCode));
        }
        /// <summary>
        /// EntityFramework Fetching
        /// </summary>
        [HttpGet, Route("GetUsersByEF")]
        public ActionResult<UserLogins> GetUsers()
        {
            using DbCommand cmd = _repository.GetTextCommand($"select * from [dbo].[UserLogins]");

            if (cmd.Connection.State == System.Data.ConnectionState.Closed)
                cmd.Connection.Open();
            try
            {
                using DbDataReader reader = cmd.ExecuteReader();
                var item = reader.MapToList<UserLogins>();
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetBalanceSummaryInfo() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
            finally
            {
                cmd.Connection.Close();
            }
        }


        /// <summary>
        /// Dappr with Single Query
        /// </summary>
        [HttpGet, Route("GetUsersByDapper")]
        public async Task<ActionResult<UserLogins>> GetUsersByDapperAsync()
        {

            try
            {
                List<UserLogins> users = await _idapperTest.GetAllDataAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetBalanceSummaryInfo() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }

        }

        /// <summary>
        /// Dapper with Stored Procedure
        /// </summary>
        [HttpPost, Route("GetUsersByDapperSP")]
        public ActionResult<ValidationResponse> GetUsersByDapperSP([FromBody] TokenRequest request)
        {

            try
            {
                ValidationResponse validationResponse = _idapperTest.GetValidation(request.LoginName, request.DeviceName, request.DeviceID);
                return Ok(validationResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetUsersByDapperSP() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }

        }

        /// <summary>
        /// LDAP Method
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("CheckUserNameAndPassword")]
        public ActionResult<string> CheckUserNameAndPassword([FromBody] TokenRequest request)
        {
            try
            {
                string empNo = _ldapService.CheckUserNameAndPassword(request.LoginName, request.Password, request.DomainName);
                return Ok(empNo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"CheckUserNameAndPassword() Encountered Fatal Database Error => {ex.Message}");
                return Ok(ex.Message);
            }

        }

    }
}
