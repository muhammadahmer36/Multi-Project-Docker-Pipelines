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
using EcotimeMobileAPI.Modules.Test.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ADAuthenticationController : Controller
    {
        private readonly ILogger _logger;
        private readonly IldapService _ldapService;
        private readonly IAuthenticateService _authService;
        private readonly IGetAppMessageCache _appMessageCache;
        private readonly IAuthenticationRepository _authRepository;

        public ADAuthenticationController(IAuthenticateService authService, ILogger<AuthenticationController> logger
         , IAuthenticationRepository authRepository, IAppMessagesRepository appMessagesRepository, IldapService ldapService)
        {
            _logger = logger;
            _ldapService = ldapService;
            _authService = authService;
            _authRepository = authRepository;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;

        }

        [AllowAnonymous, HttpPost, Route("Login")]
        public async Task<ActionResult<ApiResponseModel<LoginResponse>>> RequestToken([FromBody] TokenRequest request)
        {
            try
            {
                Task<string> employeeNumberTask = Task.Run(() => _ldapService.CheckUserNameAndPassword(request.LoginName, request.Password, request.DomainName));
                Task<AuthenticationResponse> authenticationResponseTask = Task.Run(() => _authRepository.Authenticate(request));

                await Task.WhenAll(employeeNumberTask, authenticationResponseTask);

                string employeeNumber = await employeeNumberTask;

                AuthenticationResponse authenticationResponse = await authenticationResponseTask;
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
                        EmployeeValidationItem employeeValidationItem = _authRepository.ValidateEmployeeByEmpNo(employeeNumber);

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

                if (!string.Equals(employeeNumber, authenticationResponse.AuthenticationType.EmployeeNumber.ToString()))
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
        public async Task<ActionResult<ApiResponseModel<LoginResponse>>> RegisterNewUser([FromBody] RegistrationRequest request)
        {

            try
            {
                string employeeNumber = await Task.Run(() => _ldapService.CheckUserNameAndPassword(request.LoginName, request.Password, domainName: ""));

                _logger.LogInformation($"Registering User '{request.LoginName}'");

                if (!string.Equals(employeeNumber, request.EmployeeNumber.ToString()))
                {
                    return new ApiResponseModel<LoginResponse>
                    {
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidCredentials)
                    };
                }

                byte[] salt = Misc.GetRandomSalt(16);
                string saltStr = Convert.ToBase64String(salt);
                string hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(request.Password), salt));
                request.MobileNumber = request.MobileNumber == "" ? null : request.MobileNumber;
                ValidationResponse validationResponse = await Task.Run(() =>
                {
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

    }
}
