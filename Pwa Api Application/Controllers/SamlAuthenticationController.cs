using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Services.Saml;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SamlAuthenticationController : Controller
    {
        private readonly ILogger _logger;
        private readonly ISamlService _samlService;
        private readonly IAuthenticateService _authService;
        private readonly IGetAppMessageCache _appMessageCache;
        private readonly IAuthenticationRepository _authRepository;

        public SamlAuthenticationController(IAuthenticateService authService, ILogger<AuthenticationController> logger
         , IAuthenticationRepository authRepository, IAppMessagesRepository appMessagesRepository, ISamlService samlService)
        {
            _logger = logger;
            _authService = authService;
            _authRepository = authRepository;
            _samlService = samlService;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;

        }

        [AllowAnonymous, HttpPost, Route("Login")]
        public async Task<ActionResult<ApiResponseModel<LoginResponse>>> RequestToken([FromBody] SamlAuthenticationRequest request)
        {
            try
            {
                string token = Request.Headers["Authorization"];

                if (!(await _samlService.IsValidTokenAsync(token))) return Unauthorized(GetUnAuthorizedResponse());

                string EmployeeNumber = Misc.GetEmployeeNumber(token);

                AuthenticationResponse authenticationResponse = await Task.Run(() => _authRepository.Authenticate(new TokenRequest 
                { 
                    DeviceID = request.DeviceID,
                    LoginName = request.LoginName, 
                    DeviceName = request.DeviceName
                }));

                ValidationResponse validationResponseFromDb = authenticationResponse.ValidationResponse;

                bool isUserAccountExist = validationResponseFromDb.StatusCode switch
                {
                    (int)eErrorMessageCode.LoggedInSucessfull => true,
                    (int)eErrorMessageCode.AccountIsNotConfirmed => true,
                    (int)eErrorMessageCode.SendEmailForConfirmation => true,
                    _ => false
                };

                if (!isUserAccountExist)
                {
                    if (validationResponseFromDb.StatusCode is (int)eErrorMessageCode.ADAccountDoesntExists)
                    {
                        EmployeeValidationItem employeeValidationItem = _authRepository.ValidateEmployeeByEmpNo(request.EmployeeNumber);

                        if (employeeValidationItem.ValidationResponse.StatusCode is not 0)
                        {
                            return new ApiResponseModel<LoginResponse>
                            {
                                Validation = employeeValidationItem.ValidationResponse,
                            };
                        }

                        employeeValidationItem.AuthenticationType.LoginName = request.LoginName;

                        return new ApiResponseModel<LoginResponse>
                        {
                            Validation = validationResponseFromDb,
                            IsSuccessfull = true,
                            Data = new LoginResponse
                            {
                                EmployeeDetail = employeeValidationItem.AuthenticationType
                            }
                        };
                    }

                    _logger.LogInformation($"{request.LoginName} is not loggedin, Status code: {validationResponseFromDb.StatusCode}, account is not exist");

                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = validationResponseFromDb
                    };
                }

                if (!string.Equals(request.EmployeeNumber, authenticationResponse.AuthenticationType.EmployeeNumber))
                {
                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidCredentials)
                    };
                }

                RefreshTokenResponse refreshTokenResponse = _authService.GenerateTokenAndRefreshToken(authenticationResponse.PasswordInfo, request.DeviceID, request.DeviceName);

                _ = Task.Run(() => _authRepository.UpdateRefreshTokenOnDb(authenticationResponse.PasswordInfo.UserAccountID, refreshTokenResponse.RefreshToken));

                return new ApiResponseModel<LoginResponse>
                {
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.LoggedInSucessfull),
                    IsSuccessfull = true,
                    Data = new LoginResponse
                    {
                        Token = refreshTokenResponse.AccessToken,
                        RefreshToken = refreshTokenResponse.RefreshToken,
                        Dashboard = authenticationResponse.DashboardResponse,
                        EmployeeDetail = authenticationResponse.AuthenticationType
                    }
                };
            }
            catch (Exception ex)
            {
                return Ok(new ApiResponseModel<LoginResponse>
                {
                    Validation = new ValidationResponse
                    {
                        StatusCode = (int)eErrorMessageCode.UnhandleMessagecode,
                        StatusMessage = ex.Message
                    }
                });
            }
        }

        [AllowAnonymous, HttpPost, Route("Registration")]
        public async Task<ActionResult<ApiResponseModel<LoginResponse>>> RegisterNewUser([FromBody] SamlRegistrationRequest samlRequest)
        {
            try
            {
                string token = Request.Headers["Authorization"];

                if (!(await _samlService.IsValidTokenAsync(token))) return Unauthorized(GetUnAuthorizedResponse());

                byte[] salt = Misc.GetRandomSalt(16);
                string saltStr = Convert.ToBase64String(salt);
                string hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(samlRequest.Password), salt));
                samlRequest.MobileNumber = samlRequest.MobileNumber == "" ? null : samlRequest.MobileNumber;

                ValidationResponse validationResponse = await Task.Run(() =>
                {
                    RegistrationRequest request = new RegistrationRequest();
                    request.EmployeeNumber = samlRequest.EmployeeNumber;
                    request.LoginName = samlRequest.LoginName;
                    request.EmailAddress = samlRequest.EmailAddress;
                    request.MobileNumber = samlRequest.MobileNumber;

                    return _authRepository.RegisterAccount(request, hashed_password, saltStr, confirmationCode: string.Empty, isEmailConfirmed: true);
                });

                _logger.LogInformation("Registering validationResponse {@validationResponse}", validationResponse);

                if (validationResponse.StatusCode is not (int)eErrorMessageCode.SendEmailForConfirmation)
                {
                    return new ApiResponseModel<LoginResponse>() { Validation = validationResponse };
                }

                return new ApiResponseModel<LoginResponse>
                {
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.RegistrationSuccessfull),
                    IsSuccessfull = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Registration exception => {@ex}", ex);

                return new ApiResponseModel<LoginResponse>
                {
                    Validation = new ValidationResponse
                    {
                        StatusCode = (int)eErrorMessageCode.UnhandleMessagecode,
                        StatusMessage = ex.Message
                    }
                };
            }

        }

        private ApiResponseModel<string> GetUnAuthorizedResponse()
        {
            return new ApiResponseModel<string>
            {
                HttpStatusCode = System.Net.HttpStatusCode.Unauthorized,
                Validation = new ValidationResponse
                {
                    StatusCode = (int)System.Net.HttpStatusCode.Unauthorized,
                    StatusMessage = ""
                }
            };
        }
    }
}