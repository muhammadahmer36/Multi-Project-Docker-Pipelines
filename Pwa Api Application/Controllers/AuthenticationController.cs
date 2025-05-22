using System;
using System.Text;
using System.Linq;
using System.Data.Common;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        #region Private ReadOnly Variables & Constructor

        private readonly ILogger _logger;
        private readonly IEmailService _emailService;
        private readonly IAuthenticateService _authService;
        private readonly IGetAppMessageCache _appMessageCache;
        private readonly IPasswordConfigurationCache _passwordConfigurationCache;
        private readonly IPasswordConfigurationRepository _passwordConfigurationRepository;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IAuthenticationRepository _authRepository;
        private readonly IUserManagementService _userManagementService;

        private const int NO_DASHBOARD_ITEMS_MESSAGE_ID = 11;

        public AuthenticationController(IAuthenticateService authService, IEmailService emailService
            , IAuthenticationRepository repository, IAppMessagesRepository appMessagesRepository, IPasswordConfigurationRepository passwordConfigurationRepository
            , IWebHostEnvironment hostEnvironment, ILogger<AuthenticationController> logger, IUserManagementService userManagementService)
        {
            _logger = logger;
            _authService = authService;
            _emailService = emailService;
            _authRepository = repository;
            _hostEnvironment = hostEnvironment;
            _userManagementService = userManagementService;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
            _passwordConfigurationRepository = passwordConfigurationRepository;
            _passwordConfigurationCache = _passwordConfigurationRepository;

        }

        #endregion

        #region Public End Points

        /// <summary>
        /// Logs the user into the system.
        /// </summary>

        [AllowAnonymous, HttpPost, Route("Login")]
        public ActionResult<ApiResponseModel<LoginResponse>> RequestToken([FromBody] TokenRequest request)
        {
            try
            {
                string loginName = request.LoginName;

                AuthenticationResponse authenticationResponse = _authRepository.Authenticate(request);
                ValidationResponse validationResponseFromDb = authenticationResponse.ValidationResponse;

                bool isUserAccountExist = validationResponseFromDb.StatusCode switch
                {
                    (int)eErrorMessageCode.PasswordExpired => true,
                    (int)eErrorMessageCode.LoggedInSucessfull => true,
                    (int)eErrorMessageCode.AccountIsNotConfirmed => true,
                    (int)eErrorMessageCode.SendEmailForConfirmation => true,
                    _ => false
                };

                if (!isUserAccountExist)
                {
                    _logger.LogInformation($"{request.LoginName} is not loggedin, Status code: {validationResponseFromDb.StatusCode}, account is not exist");

                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = validationResponseFromDb
                    };
                }

                if (!_userManagementService.IsValidPassword(request.Password, authenticationResponse.PasswordInfo))
                {
                    _logger.LogInformation($"{request.LoginName} is not loggedin, Status code: {eErrorMessageCode.InvalidCredentials}, invalid credentials");

                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = _authRepository.UpdateFailAttempCounts(request, isValidPassword: false)
                    };
                }

                _logger.LogInformation($"{loginName} is authenticated");

                if (validationResponseFromDb.StatusCode is (int)eErrorMessageCode.PasswordExpired)
                {
                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = validationResponseFromDb
                    };
                }
                
                _ = Task.Run(() => _authRepository.UpdateFailAttempCounts(request, isValidPassword: true));

                LoginResponse loginResponse = new LoginResponse
                {
                    EmployeeDetail = authenticationResponse.AuthenticationType
                };


                if (validationResponseFromDb.StatusCode is (int)eErrorMessageCode.LoggedInSucessfull)
                {
                    RefreshTokenResponse refreshTokenResponse = _authService.GenerateTokenAndRefreshToken(authenticationResponse.PasswordInfo, request.DeviceID, request.DeviceName);

                    _ = Task.Run(() => _authRepository.UpdateRefreshTokenOnDb(authenticationResponse.PasswordInfo.UserAccountID, refreshTokenResponse.RefreshToken));

                    loginResponse.Token = refreshTokenResponse.AccessToken;
                    loginResponse.RefreshToken = refreshTokenResponse.RefreshToken;
                    loginResponse.Dashboard = authenticationResponse.DashboardResponse;
                }
                else if (validationResponseFromDb.StatusCode is (int)eErrorMessageCode.SendEmailForConfirmation)
                {
                    SendConfirmationCodeOnEmail(authenticationResponse.AuthenticationType.EmployeeEmail, authenticationResponse.AuthenticationType.EmployeeNumber);
                    validationResponseFromDb = _appMessageCache.GetAppMessageById(eErrorMessageCode.AccountIsNotConfirmed);
                }

                validationResponseFromDb.StatusMessage = string.Format(validationResponseFromDb.StatusMessage, Misc.HideEmail(authenticationResponse.AuthenticationType.EmployeeEmail));

                return new ApiResponseModel<LoginResponse>
                {
                    Validation = validationResponseFromDb,
                    IsSuccessfull = true,
                    Data = loginResponse
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"RequestToken() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }


        /// <summary>
        /// Exchanges expired access token with a new one.
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("RefreshToken")]
        public ActionResult<ApiResponseModel<RefreshTokenResponse>> RefreshTokens([FromBody] RefreshTokenRequest request)
        {
            try
            {
                _logger.LogInformation($"Getting Refresh Token");

                int accountID = _authService.GetAccountIDFromExpiredToken(request.AccessToken);


                RefreshTokenItem savedRefreshInfo = _authRepository.GetRefreshToken(accountID);

                if (savedRefreshInfo == null)
                {
                    return Unauthorized(new ApiResponseModel<RefreshTokenResponse>
                    {
                        HttpStatusCode = System.Net.HttpStatusCode.Unauthorized,
                        Validation = new ValidationResponse
                        {
                            StatusCode = (int)eErrorMessageCode.UnhandleMessagecode,
                            StatusMessage = "Invalid refresh token, please provide a valid refresh token or try relogin."
                        }
                    });
                }

                string savedRefreshToken = savedRefreshInfo?.RefreshToken;
                DateTime savedRefreshExpiryTime = savedRefreshInfo.ExpiryDate;

                if (savedRefreshToken == null || savedRefreshToken != request.RefreshToken || savedRefreshExpiryTime <= DateTime.UtcNow)
                {
                    return Unauthorized(new ApiResponseModel<RefreshTokenResponse>
                    {
                        HttpStatusCode = System.Net.HttpStatusCode.Unauthorized,
                        Validation = new ValidationResponse
                        {
                            StatusCode = (int)eErrorMessageCode.UnhandleMessagecode,
                            StatusMessage = "Invalid refresh token, please provide a valid refresh token or try relogin."
                        }
                    });
                }

                RefreshTokenResponse item = _authService.GetRefreshToken(request.AccessToken);

                _ = Task.Run(() => _authRepository.UpdateRefreshTokenOnDb(accountID, item.RefreshToken));

                return Ok(new ApiResponseModel<RefreshTokenResponse>
                {
                    IsSuccessfull = true,
                    Validation = new ValidationResponse { StatusCode = 0, StatusMessage = "Refresh token." },
                    Data = item,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("RefreshTokens() Encountered Fatal Database {@Error}", ex);
                throw;
            }
        }

        /// <summary>
        /// Validates that the user exists in the system and is currently active.
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("UserValidation")]
        public async Task<ActionResult<ApiResponseModel<EmployeeValidationResponse>>> ValidateNewUser([FromBody] ValidUserRequest request)
        {
            try
            {
                string empno = request.EmployeeNumber;
                int returnStatus = 0;
                _logger.LogInformation($"Checking if Employee with empno = '{empno}' is valid for registration");

                EmployeeValidationItem employeValidation = await Task.Run(() => _authRepository.ValidateEmployeeByEmpNo(request.EmployeeNumber));

                if (employeValidation.ValidationResponse.StatusCode is (int)eErrorMessageCode.SendEmailForConfirmation)
                {
                    SendConfirmationCodeOnEmail(employeValidation.AuthenticationType.EmployeeEmail, employeValidation.AuthenticationType.EmployeeNumber);
                    employeValidation.ValidationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.AccountIsNotConfirmed);
                }

                if (employeValidation.ValidationResponse.StatusCode is (int)eErrorMessageCode.AccountIsNotConfirmed)
                {
                    employeValidation.ValidationResponse.StatusMessage =
                        string.Format(employeValidation.ValidationResponse.StatusMessage, Misc.HideEmail(employeValidation.AuthenticationType.EmployeeEmail));
                }

                bool isSuccess = employeValidation.ValidationResponse.StatusCode switch
                {
                    (int)eErrorMessageCode.AccountIsNotConfirmed or 0 => true,
                    _ => false
                };

                return Ok(new ApiResponseModel<EmployeeValidationResponse>
                {
                    IsSuccessfull = isSuccess,
                    Validation = employeValidation.ValidationResponse,
                    Data = isSuccess ? employeValidation : null
                });

            }
            catch (Exception ex)
            {
                _logger.LogError("ValidateNewUser() Encountered Fatal Database {@Error}", ex);
                throw;
            }
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("Registration")]
        public async Task<ActionResult<ApiResponseModel<ValidationResponse>>> RegisterNewUser([FromBody] RegistrationRequest request)
        {

            try
            {
                PasswordValidation passwordValidation = (HttpContext.RequestServices.GetService(typeof(PasswordConfigurationCache)) as PasswordConfigurationCache)?.GetPasswordValidation();

                if (!Misc.IsPasswordValid(passwordValidation, request.Password, out string errMsg))
                {
                    ValidationResponse validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.PasswordConfigurationFails);
                    validation.StatusMessage = string.Format(validation.StatusMessage, errMsg);
                    return Ok(new ApiResponseModel<string>
                    {
                        Validation = validation
                    });
                }

                string loginName = request.LoginName;
                _logger.LogInformation($"Registering User '{loginName}'");

                byte[] salt = Misc.GetRandomSalt(16);
                string saltStr = Convert.ToBase64String(salt);
                string hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(request.Password), salt));
                request.MobileNumber = request.MobileNumber == "" ? null : request.MobileNumber;
                string confirmationCode = Misc.GenerateTempCode(6);
                _logger.LogInformation("Registering confirmationCode {@confirmationCode}", confirmationCode);

                ValidationResponse validationResponse = await Task.Run(() => _authRepository.RegisterAccount(request, hashed_password, saltStr, confirmationCode));

                _logger.LogInformation("Registering validationResponse {@validationResponse}", validationResponse);

                if (validationResponse.StatusCode is not (int)eErrorMessageCode.SendEmailForConfirmation)
                {
                    if (validationResponse.StatusCode is (int)eErrorMessageCode.AccountIsNotConfirmed)
                        validationResponse.StatusMessage = string.Format(validationResponse.StatusMessage, Misc.HideEmail(request.EmailAddress));

                    return Ok(new ApiResponseModel<ValidationResponse>() { Validation = validationResponse });
                }

                try
                {
                    SendConfirmationCodeOnEmail(request.EmailAddress, request.EmployeeNumber);
                }
                catch (Exception ex)
                {
                    _logger.LogError("RegisterNewUser() Encountered Fatal mailkit error {@ex}", ex);
                }

                validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.AccountIsNotConfirmed);
                validationResponse.StatusMessage = string.Format(validationResponse.StatusMessage, Misc.HideEmail(request.EmailAddress));

                return Ok(new ApiResponseModel<ValidationResponse>
                {
                    Validation = validationResponse,
                    IsSuccessfull = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Registration exception => {@ex}", ex);

                throw;
            }

        }

        [AllowAnonymous, HttpPost, Route("ConfirmAccount")]
        public async Task<ActionResult<ApiResponseModel<string>>> ConfirmAccount([FromBody] ConfirmRegistrationRequest request)
        {
            try
            {
                _logger.LogInformation("ConfirmAccount => request {@request}", request);

                ValidationResponse validationResponse = await Task.Run(() => _authRepository.ConfirmAccount(request));
                _logger.LogInformation("ConfirmAccount => validationResponse {@validationResponse}", validationResponse);

                return Ok(new ApiResponseModel<string>
                {
                    Validation = validationResponse,
                    IsSuccessfull = validationResponse.StatusCode is (int)eErrorMessageCode.RegistrationSuccessfull
                });
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ConfirmAccount exception => {@ex}", ex);
                throw;
            }
        }

        /// <summary>
        /// Recovers user password.
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("RecoverPassword")]
        public ActionResult<ValidationResponse> RecoverPassword([FromBody] RecoverPasswordRequest request)
        {
            try
            {
                string empno = request.EmployeeNumber;
                int returnStatus = 0;
                _logger.LogInformation($"Recovering password for Employee with empno = '{empno}'");

                string tempPassword = Misc.GenerateTempPassword(6); // Send to user
                byte[] saltValue = Misc.GetRandomSalt(16);
                string passwordSalt = Convert.ToBase64String(saltValue); // Send to procedure
                string passwordHash = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(tempPassword), saltValue)); // Send to procedure
                RecoverPasswordResponse item = new RecoverPasswordResponse();
                ValidationResponse rsp = new ValidationResponse();

                using DbCommand command = _authRepository.GetStoredProcedure("[dbo].[RecoverPassword]")
                    .WithSqlParams
                        (("in_employeenumber", request.EmployeeNumber),
                          ("in_passwordhash", passwordHash),
                          ("in_passwordsalt", passwordSalt),
                          ("in_sendemail", request.SendToEmail),
                          ("in_sendtext", request.SendToText),
                          ("in_deviceid", request.DeviceID),
                          ("in_devicename", request.DeviceName)
                        );

                if (command.Connection.State == System.Data.ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using DbDataReader reader = command.ExecuteReader();
                    item.ValidationResponse = reader.MapToSingle<ValidationResponse>();
                    rsp = item.ValidationResponse.Clone();
                    if (rsp.StatusCode == 0)
                    {
                        item.ContactInfo = reader.MapToSingle<ContactInfo>();
                    }
                    else
                    {
                        _logger.LogWarning(rsp.StatusMessage);
                        returnStatus = rsp.StatusCode;
                    }
                }
                finally
                {
                    command.Connection.Close();
                }

                // Send Temp Password to User
                if (returnStatus == 0)
                {
                    if (request.SendToEmail)
                    {
                        try
                        {
                            EmailMessage msg = new EmailMessage();
                            msg.ToAddresses.Add(new EmailAddress { Name = "", Address = item.ContactInfo.EmailAddress });
                            msg.Subject = item.ContactInfo.Subject;
                            msg.Content = item.ContactInfo.MessageToSend.Replace("%PSW", tempPassword);
                            _emailService.SendEmail(msg);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                            return BadRequest("Failed to send email => " + ex.Message);
                        }
                    }

                    //if(request.SendToText)
                    //{

                    //}
                }

                return Ok(rsp);
            }
            catch (Exception ex)
            {
                _logger.LogError($"RecoverPassword() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Sets new password. after password is expired
        /// </summary>
        [AllowAnonymous, HttpPost, Route("SetNewPassword")]
        public async Task<ActionResult<ApiResponseModel<LoginResponse>>> SetNewPassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                _logger.LogInformation("SetNewPassword => request {@request}", request);

                PasswordValidation passwordValidation = (HttpContext.RequestServices.GetService(typeof(PasswordConfigurationCache)) as PasswordConfigurationCache)?.GetPasswordValidation();

                if (!Misc.IsPasswordValid(passwordValidation, request.Password, out string errMsg))
                {
                    ValidationResponse validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.PasswordConfigurationFails);
                    validation.StatusMessage = string.Format(validation.StatusMessage, errMsg);
                    return Ok(new ApiResponseModel<string>
                    {
                        Validation = validation
                    });
                }

                Task<bool> isMyPreviousPasswordTask = IsPreviousPassword(request.LoginName, request.Password);
            
                AuthenticationResponse authenticationResponse = await Task.Run(() => _authRepository.GetEmployeeByUserName(request.LoginName));

                if (authenticationResponse.ValidationResponse.StatusCode is not (int)eErrorMessageCode.PasswordExpired &&
                    authenticationResponse.ValidationResponse.StatusCode is not (int)eErrorMessageCode.AccountIsNotConfirmed)
                {
                    return Ok(new ApiResponseModel<LoginResponse> { Validation = authenticationResponse.ValidationResponse });
                }

                if (!_userManagementService.IsValidPassword(request.OldPassword, authenticationResponse.PasswordInfo))
                {
                    _logger.LogInformation("{request.LoginName} is not loggedin, Status code: {eErrorMessageCode.InvalidCredentials}, invalid credentials."
                        , request.LoginName, eErrorMessageCode.InvalidCredentials.ToString());

                    return new ApiResponseModel<LoginResponse> { Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidCredentials) };
                }

                bool isMyPreviousPassword = await isMyPreviousPasswordTask;

                if (isMyPreviousPassword)
                {
                    return Ok(new ApiResponseModel<string>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.CannotSetPreviousPassword)
                    });
                }

                Task<RefreshTokenResponse> refreshTokenResponseTask = Task.Run(() => 
                    _authService.GenerateTokenAndRefreshToken(authenticationResponse.PasswordInfo, request.DeviceID, request.DeviceName));
                
                byte[] salt = Misc.GetRandomSalt(16);
                string saltStr = Convert.ToBase64String(salt);
                string hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(request.Password), salt));

                ValidationResponse validationResponse = await Task.Run(() => _authRepository.SetNewPassword(authenticationResponse.PasswordInfo.UserAccountID, hashed_password, saltStr));

                _logger.LogInformation("SetNewPassword => validationResponse {@validationResponse}", validationResponse);

                if (authenticationResponse.ValidationResponse.StatusCode is (int)eErrorMessageCode.AccountIsNotConfirmed)
                {
                    authenticationResponse.ValidationResponse.StatusMessage =
                       string.Format(authenticationResponse.ValidationResponse.StatusMessage, Misc.HideEmail(authenticationResponse.AuthenticationType.EmployeeEmail));

                    return Ok(new ApiResponseModel<LoginResponse> { Validation = authenticationResponse.ValidationResponse });
                }

                RefreshTokenResponse refreshTokenResponse = await refreshTokenResponseTask;

                return Ok(new ApiResponseModel<LoginResponse>
                {
                    IsSuccessfull = validationResponse.StatusCode is (int)eErrorMessageCode.PasswordUpdated,
                    Validation = validationResponse,
                    Data = new LoginResponse
                    {
                        Token = refreshTokenResponse.AccessToken,
                        RefreshToken = refreshTokenResponse.RefreshToken,
                        Dashboard = authenticationResponse.DashboardResponse,
                        EmployeeDetail = authenticationResponse.AuthenticationType
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"SetNewPassword() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }


        /// <summary>
        /// api for forgetpassword.
        /// </summary>
        [AllowAnonymous]
        [HttpPost, Route("ForgetPassword")]
        public async Task<ActionResult<ApiResponseModel<dynamic>>> ForgetPassword([FromBody] ForgetPasswordRequest request)
        {

            try
            {
                var employeeValidation = await Task.Run(() => _authRepository.ValidateEmployeeByUserName(request.LoginName));

                if (employeeValidation.ValidationResponse.StatusCode is not (int)eErrorMessageCode.SendTempPasswordOnEmail)
                {
                    return Ok(new ApiResponseModel<dynamic>
                    {
                        Validation = employeeValidation.ValidationResponse
                    });
                }

                string tempPassword = Misc.GenerateTempPassword(6);
                _logger.LogInformation("ForgetPassword => tempPassword IS {@tempPassword}", tempPassword);

                string updatePasswordHash = Misc.GenerateUpdatePasswordHash($"{tempPassword}~{request.LoginName.ToLower()}");
                _logger.LogInformation("ForgetPassword => tempPassword hash {@updatePasswordHash}", updatePasswordHash);

                _ = Task.Run(() => _authRepository.UpdateRefreshTokenOnDb(employeeValidation.EmployeeAccount.AccountId, updatePasswordHash));

                try
                {
                    string completePath = $"{_hostEnvironment.ContentRootPath}{Constants.EmailTemplatePathForRecoverPassword}";

                    string emailHtmlTemplate = Misc.GetTemplateBody(completePath);
                    _logger.LogInformation("ForgetPassword => emailHtmlTemplate {@emailHtmlTemplate}", emailHtmlTemplate);

                    string emailContent = emailHtmlTemplate.FormatHtml(tempPassword);

                    EmailMessage msg = new EmailMessage
                    {
                        Subject = request.IsAccountActivation ? Constants.SubjectForAccountActivation : Constants.SubjectForPasswordRecovery,
                        Content = emailContent
                    };

                    msg.ToAddresses.Add(new EmailAddress { Address = employeeValidation.EmployeeAccount.EmployeeEmail });

                    _emailService.SendEmail(msg);
                }
                catch (Exception ex)
                {
                    _logger.LogError("ForgetPassword() Encountered Fatal mailkit error {@ex}", ex);
                }

                employeeValidation.ValidationResponse.StatusMessage =
                    string.Format(employeeValidation.ValidationResponse.StatusMessage, Misc.HideEmail(employeeValidation.EmployeeAccount.EmployeeEmail));

                return Ok(new ApiResponseModel<dynamic>
                {
                    IsSuccessfull = true,
                    Data = new { authenticationType = employeeValidation.EmployeeAccount },
                    Validation = employeeValidation.ValidationResponse
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("ForgetPassword() Encountered Fatal mailkit error {@ex}", ex);
                throw;
            }

        }

        /// <summary>
        /// api for forgetusername.
        /// </summary>
        [AllowAnonymous, HttpPost, Route("ForgetUsername")]
        public async Task<ActionResult<ApiResponseModel<string>>> ForgetUsername([FromBody] ValidUserRequest request)
        {
            try
            {
                _logger.LogInformation("ForgetUsername() request => {@request}", request);

                var employee = await Task.Run(() => _authRepository.GetEmployeeByEmpNo(request.EmployeeNumber));
                _logger.LogInformation("ForgetUsername() employee detail => {@employee}", employee);

                ValidationResponse validationResponse = employee?.ValidationResponse;
                _logger.LogInformation("ForgetUsername() validationResponse => {@validationResponse}", validationResponse);
                bool isAccountExist = validationResponse?.StatusCode is (int)eErrorMessageCode.SendEmailForConfirmation 
                                    || validationResponse?.StatusCode is (int)eErrorMessageCode.AccountAllreadyExists;
                if (!isAccountExist)
                {
                    return Ok(new ApiResponseModel<string> { Validation = validationResponse });                
                }
                try
                {
                    string completePath = $"{_hostEnvironment.ContentRootPath}{Constants.EmailTemplatePathForRecoverUsername}";

                    string emailHtmlTemplate = Misc.GetTemplateBody(completePath);
                    _logger.LogInformation("ForgetUsername => emailHtmlTemplate {@emailHtmlTemplate}", emailHtmlTemplate);

                    string emailContent = emailHtmlTemplate.FormatHtml(employee?.AuthenticationType?.LoginName);

                    EmailMessage msg = new EmailMessage
                    {
                        Subject = Constants.SubjectForUsernameRecovery,
                        Content = emailContent
                    };

                    msg.ToAddresses.Add(new EmailAddress { Address = employee?.AuthenticationType?.EmployeeEmail });

                    _emailService.SendEmail(msg);
                    validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.ForgotUsername);
                    validationResponse.StatusMessage = string.Format(validationResponse?.StatusMessage, Misc.HideEmail(employee?.AuthenticationType?.EmployeeEmail));

                    return Ok(new ApiResponseModel<string> { Validation = validationResponse, IsSuccessfull = true });
                }
                catch (Exception ex)
                {
                    _logger.LogError("ForgetUsername() Encountered Fatal mailkit error {@ex}", ex);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ForgetUsername() Exception => {@ex}", ex);

                throw;
            }
        }

        /// <summary>
        /// Sets new password.
        /// </summary>
        [AllowAnonymous, HttpPost, Route("UpdatePassword")]
        public async Task<ActionResult<ApiResponseModel<string>>> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            try
            {

                PasswordValidation passwordValidation = (HttpContext.RequestServices.GetService(typeof(PasswordConfigurationCache)) as PasswordConfigurationCache)?.GetPasswordValidation();

                if (!Misc.IsPasswordValid(passwordValidation, request.Password, out string errMsg))
                {
                    ValidationResponse validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.PasswordConfigurationFails);
                    validation.StatusMessage = string.Format(validation.StatusMessage, errMsg);
                    return Ok(new ApiResponseModel<string>
                    {
                        Validation = validation
                    });
                }

                bool isMyPreviousPassword = await IsPreviousPassword(request.LoginName, request.Password);

                if (isMyPreviousPassword)
                {
                    return Ok(new ApiResponseModel<string>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.CannotSetPreviousPassword)
                    });
                }

                _logger.LogInformation("UpdatePassword => request {@request}", request);

                byte[] salt = Misc.GetRandomSalt(16);
                string saltStr = Convert.ToBase64String(salt);
                string hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(request.Password), salt));

                string updatePasswordHash = Misc.GenerateUpdatePasswordHash($"{request.TempPassword}~{request.LoginName.ToLower()}");
                _logger.LogInformation("UpdatePassword => updatePasswordHash {@updatePasswordHash}", updatePasswordHash);

                ValidationResponse validationResponse = await Task.Run(() => _authRepository.UpdatePassword(request, hashed_password, saltStr, updatePasswordHash));
                _logger.LogInformation("UpdatePassword => validationResponse {@validationResponse}", validationResponse);

                return Ok(new ApiResponseModel<string>
                {
                    IsSuccessfull = validationResponse.StatusCode is (int)eErrorMessageCode.PasswordUpdated,
                    Validation = validationResponse
                });
            }
            catch (Exception ex)
            {
                _logger.LogInformation("UpdatePassword exception => request {@ex}", ex);
                throw;
            }
        }

        /// <summary>
        /// Gets password validation rules.
        /// </summary>
        [AllowAnonymous, HttpGet, Route("PasswordRules")]
        public async Task<ActionResult<ApiResponseModel<PasswordValidation>>> GetPasswordValidationRules()
        {
            try
            {
                _logger.LogInformation("Retrieving password validation rules");
                PasswordValidation passwordValidation = await Task.Run(() => _passwordConfigurationCache.GetPasswordValidation());

                return Ok(new ApiResponseModel<PasswordValidation>
                {
                    IsSuccessfull = passwordValidation is not null,
                    Data = passwordValidation
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetPasswordValidationRules() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets dashboard items for logged in user.
        /// </summary>
        [HttpGet, Route("Dashboard")]
        public ActionResult<DashboardWithStatus> GetDashboardItems()
        {
            try
            {
                int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
                _logger.LogInformation($"Get Dashboard Items for userAccountID = '{userAccountID}'");

                DashboardWithStatus item = new DashboardWithStatus();

                using DbCommand command = _authRepository.GetStoredProcedure("[dbo].[Dashboard_Get]").WithSqlParams(("in_useraccountid", userAccountID));

                if (command.Connection.State == System.Data.ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using DbDataReader reader = command.ExecuteReader();
                    DashboardResponse rsp = GetDashboardResponse(reader);

                    if (rsp != null)
                    {
                        item.ValidationResponse = new ValidationResponse { StatusCode = 0, StatusMessage = string.Empty };
                        item.Dashboard = rsp;
                        return Ok(item);
                    }
                    else
                    {
                        int returnStatus = NO_DASHBOARD_ITEMS_MESSAGE_ID;
                        string errMsg = GetStatusMessage(returnStatus);
                        item.ValidationResponse = new ValidationResponse { StatusCode = returnStatus, StatusMessage = errMsg };
                        _logger.LogWarning(errMsg);
                        return Ok(item);
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetDashboardItems() Encountered Fatal Database Error => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        [AllowAnonymous, HttpPost, Route("ResendConfirmationCode")]
        public async Task<ActionResult<string>> ResendConfirmationCode([FromBody] ValidUserRequest request)
        {
            try
            {
                _logger.LogInformation("ResendConfirmationCode() request => {@request}", request);

                var employee = await Task.Run(() => _authRepository.GetEmployeeByEmpNo(request.EmployeeNumber));
                _logger.LogInformation("ResendConfirmationCode() employee detail => {@employee}", employee);

                ValidationResponse validationResponse = employee.ValidationResponse;
                _logger.LogInformation("ResendConfirmationCode() validationResponse => {@validationResponse}", validationResponse);

                if (validationResponse.StatusCode is not (int)eErrorMessageCode.SendEmailForConfirmation)
                    return Ok(new ApiResponseModel<string> { Validation = validationResponse });

                validationResponse.StatusMessage = string.Format(validationResponse.StatusMessage, Misc.HideEmail(employee.AuthenticationType.EmployeeEmail));

                SendConfirmationCodeOnEmail(employee.AuthenticationType.EmployeeEmail, employee.AuthenticationType.EmployeeNumber);
                _logger.LogInformation("ResendConfirmationCode() validationResponse => {@validationResponse}", validationResponse);

                return Ok(new ApiResponseModel<string> { Validation = validationResponse, IsSuccessfull = true });

            }
            catch (Exception ex)
            {
                _logger.LogInformation("ResendConfirmationCode() Exception => {@ex}", ex);

                throw;
            }
        }

        [AllowAnonymous]
        [HttpGet, Route("GetAuthenticationType")]
        public async Task<ActionResult<ApiResponseModel<AuthenticationTypeResponse>>> GetAuthenticationType()
        {
            try
            {
                eAuthenticationType authenticationType = (eAuthenticationType)await _authRepository.GetAuthenticationTypeAsync();
                _logger.LogInformation($"GetAuthenticationType() authenticationType => {authenticationType}");

                return Ok(new ApiResponseModel<AuthenticationTypeResponse>
                {
                    Data = new AuthenticationTypeResponse { AuthenticationTypeId = authenticationType, AuthenticationType = authenticationType.ToString() },
                    eResponseMessageType = eResponseMessageStatusType.success, 
                    IsSuccessfull = true, 
                });
            }
            
            catch (Exception ex)
            {
                _logger.LogError($"GetAuthenticationType() Exception => {ex.Message}");
                return Ok(new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message });
            }
        }

        #endregion

        #region Private Helper Methods


        private async Task<bool> IsPreviousPassword(string loginName, string password)
        {
            var passwords = await Task.Run(() => _passwordConfigurationRepository.GetPreviousPasswordsByLoginName(loginName));

            return passwords.Any(x => _userManagementService.IsValidPassword(password, x));
        }

        private void SendConfirmationCodeOnEmail(string email, string empNo)
        {
            try
            {

                string confirmationCode = Misc.GenerateTempCode(6);
                _logger.LogInformation("SendConfirmationCodeOnEmail {@confirmationCode}", confirmationCode);

                string completePath = $"{_hostEnvironment.ContentRootPath}{Constants.EmailTemplatePathForConfirmPassword}";
                string emailHtmlTemplate = Misc.GetTemplateBody(completePath);
                string emailContent = emailHtmlTemplate.FormatHtml(confirmationCode);

                EmailMessage msg = new EmailMessage
                {
                    Subject = Constants.SubjectForConfirmCodeEmail,
                    Content = emailContent
                };

                msg.ToAddresses.Add(new EmailAddress { Address = email });

                _emailService.SendEmail(msg);

                _ = Task.Run(() => _authRepository.UpdateConfirmationCode(empNo, confirmationCode));
            }
            catch (Exception ex)
            {
                _logger.LogInformation("SendConfirmationCodeOnEmail() Exception => {@ex}", ex);

                throw;
            }
        }

        private DashboardResponse GetDashboardResponse(DbDataReader reader)
        {
            DashboardResponse item = new DashboardResponse
            {
                ApplicationInfo = reader.MapToSingle<ApplicationInfo>(),
                ResourceInfo = reader.MapToSingle<ResourceInfo>(),
                DashboardItems = reader.MapToList<DashboardItem>(),
            };

            if (item.DashboardItems.Count == 0 || item.ApplicationInfo == null || (item.ApplicationInfo != null && string.IsNullOrEmpty(item.ApplicationInfo.UserEmpNo)))
                return null;

            return item;
        }

        private string GetStatusMessage(int code)
        {
            using DbCommand cmd = _authRepository.GetTextCommand($"SELECT [dbo].[getappmessage]({code}, 0)");

            if (cmd.Connection.State == System.Data.ConnectionState.Closed)
                cmd.Connection.Open();
            try
            {
                return cmd.ExecuteScalar().ToString();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }


        private ValidationResponse GetMaxTriesResult(TokenRequest request, bool validPassword)
        {
            bool connectionAlreadyOpen = true;
            try
            {
                using DbCommand cmd = _authRepository.GetStoredProcedure("[dbo].[UpdateLoginAttempts]")
                    .WithSqlParams
                        (("in_loginname", request.LoginName),
                          ("in_devicename", request.DeviceName),
                          ("in_deviceid", request.DeviceID),
                          ("in_validpassword", validPassword)
                        );

                if (cmd.Connection.State == System.Data.ConnectionState.Closed)
                {
                    connectionAlreadyOpen = false;
                    cmd.Connection.Open();
                }
                try
                {
                    using DbDataReader reader = cmd.ExecuteReader();
                    ValidationResponse rsp = reader.MapToSingle<ValidationResponse>();
                    return rsp;
                }
                finally
                {
                    if (connectionAlreadyOpen == false)
                        cmd.Connection.Close();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetMaxTriesResult() Encountered Fatal Database Error => {ex.Message}");
                ValidationResponse rsp = new ValidationResponse { StatusCode = ex.HResult, StatusMessage = ex.Message };
                return rsp;
            }
        }

        #endregion
    }
}