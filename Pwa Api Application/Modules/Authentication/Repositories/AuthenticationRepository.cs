using Dapper;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Contexts;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.Geofencing.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public class AuthenticationRepository : StoredProcRepository, IAuthenticationRepository
    {

        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly TokenManagement _tokenManagement;

        private readonly string connectionString;
        public AuthenticationRepository(AuthenticationContext dbContext
            , IConfiguration config
            , ILogger<AuthenticationRepository> logger
            , IOptions<TokenManagement> tokenManagement
            )
            : base(dbContext)
        {
            _config = config;
            _logger = logger;
            _tokenManagement = tokenManagement.Value;
            connectionString = _config.GetConnectionString("HBSData");

        }

        public ValidationResponse GetValidationResponseByStatusCode(int statusCode)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("statusCode", statusCode);

            // Call the stored procedure
            IEnumerable<ValidationResponse> validationResponse = connection.Query<ValidationResponse>("[dbo].[GetValidationResponseByStatusCode]", parameters, commandType: CommandType.StoredProcedure);

            return validationResponse.FirstOrDefault();

        }

        public RefreshTokenItem GetRefreshToken(int accountID)
        {
            try
            {
                _logger.LogInformation("Getting Refresh Token from Db with {@accountID}", accountID);

                using var connection = new SqlConnection(connectionString);
                connection.Open();

                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_useraccountid", accountID);

                // Call the stored procedure
                RefreshTokenItem validationResponse = connection.QueryFirstOrDefault<RefreshTokenItem>("[dbo].[RefreshToken_Get]", parameters, commandType: CommandType.StoredProcedure);

                _logger.LogInformation("Getting Refresh Token from Db with {@validationResponse}", validationResponse);

                return validationResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError("GetRefreshToken() Encountered Fatal Database {@Error}", ex);

                throw;
            }

        }

        private DashboardResponse MapDashboardResponse(SqlMapper.GridReader reader)
        {
            DashboardResponse item = new DashboardResponse
            {
                ApplicationInfo = reader.MapToSingle<ApplicationInfo>(),
                ResourceInfo = reader.MapToSingle<ResourceInfo>(),
                DashboardItems = reader.MapToList<DashboardItem>(),
            };

            if (item.DashboardItems == null || item.DashboardItems.Count == 0 || item.ApplicationInfo == null || (item.ApplicationInfo != null && string.IsNullOrEmpty(item.ApplicationInfo.UserEmpNo)))
                return null;

            return item;
        }


        public void UpdateRefreshTokenOnDb(int accountID, string refreshToken)
        {
            DateTime expiryDate = DateTime.UtcNow.AddDays(_tokenManagement.RefreshTokenExpiration);
            UpdatePasswordTokenOnDb(accountID, refreshToken, expiryDate);
        }


        public void UpdatePasswordTokenOnDb(int accountID, string refreshToken)
        {
            DateTime expiryDate = DateTime.UtcNow.AddMinutes(_tokenManagement.AccessExpiration);
            UpdatePasswordTokenOnDb(accountID, refreshToken, expiryDate);
        }

        public AuthenticationResponse Authenticate(TokenRequest request)
        {
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();


                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_loginname", request.LoginName);
                parameters.Add("in_devicename", request.DeviceName);
                parameters.Add("in_deviceid", request.DeviceID);

                using var multipleQueryResult = connection.QueryMultiple("[dbo].[UserAuth]", parameters, commandType: CommandType.StoredProcedure);

                return new AuthenticationResponse
                {
                    ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                    PasswordInfo = multipleQueryResult.MapToSingle<PasswordInfoItem>(),
                    DashboardResponse = MapDashboardResponse(multipleQueryResult),
                    AuthenticationType = multipleQueryResult.MapToSingle<AuthenticationType>()
                };


            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Authenticate() {@error} {@reuqest}", ex, request);
                throw;
            }
        }

        public EmployeeValidationItem ValidateEmployeeByEmpNo(string employeeNumber)
        {
            _logger.LogInformation("GetEmployeeByEmpNo() Employee Numer {@employeeNumber}", employeeNumber);

            EmployeeValidationItem employeeValidationItem = new EmployeeValidationItem();

            try
            {

                using var connection = new SqlConnection(connectionString);
                connection.Open();

                var parameters = new DynamicParameters();

                parameters.Add("in_employeenumber", employeeNumber);

                using var multipleQueryResult = connection.QueryMultiple("[dbo].[RGST_ValidateEmployee]", parameters, commandType: CommandType.StoredProcedure);

                employeeValidationItem.ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>();
                employeeValidationItem.AuthenticationType = multipleQueryResult.MapToSingle<AuthenticationType>();
                employeeValidationItem.PasswordValidation = multipleQueryResult.MapToSingle<PasswordValidation>();

                _logger.LogInformation("response from database {@employeeValidationItem}", employeeValidationItem);

            }
            catch (Exception ex) { }

            return employeeValidationItem;
        }

        public ValidationResponse RegisterAccount(RegistrationRequest request, string passwordHash, string passwordSalt, string confirmationCode, bool isEmailConfirmed)
        {

            _logger.LogInformation("account registration for {@request}, {@passwordHash}, {@passwordSalt}", request, passwordHash, passwordSalt);
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("in_passwordhash", passwordHash);
            parameters.Add("in_passwordsalt", passwordSalt);
            parameters.Add("in_employeenumber", request.EmployeeNumber);
            parameters.Add("in_loginname", request.LoginName);
            parameters.Add("in_emailaddress", request.EmailAddress);
            parameters.Add("in_mobilenumber", request.MobileNumber);
            parameters.Add("in_isemailconfirmed", isEmailConfirmed);

            ValidationResponse validationResponse = connection.QueryFirstOrDefault<ValidationResponse>
                ("[dbo].[RGST_UserAccount_Ins]", parameters, commandType: CommandType.StoredProcedure);

            _logger.LogInformation("validation Response for {@request}, validation Response {@validationResponse}", request, validationResponse);

            if (validationResponse == null) throw new NullReferenceException("validations object cannot be null.");

            return validationResponse;
        }

        public ValidationResponse ConfirmAccount(ConfirmRegistrationRequest request)
        {
            _logger.LogInformation("account registration for {@request}, {@passwordHash}, {@passwordSalt}", request);
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("in_code", request.ConfirmationCode);
            parameters.Add("in_employeenumber", request.EmployeeNumber);

            ValidationResponse validationResponse = connection.QueryFirstOrDefault<ValidationResponse>
                ("[dbo].[RGST_Confirmation]", parameters, commandType: CommandType.StoredProcedure);

            _logger.LogInformation("validation Response for {@request}, validation Response {@validationResponse}", request, validationResponse);

            if (validationResponse == null) throw new NullReferenceException("validations object cannot be null.");

            return validationResponse;
        }

        public EmployeeValidationItem ValidateEmployeeByUserName(string userName)
        {

            _logger.LogInformation("GetEmployeeByUserName", userName);

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("@in_loginname", userName);

            EmployeeValidationItem employeeValidationItem = new EmployeeValidationItem();

            using var multipleQueryResult = connection.QueryMultiple("[dbo].[ValidateUserByLoginName]", parameters, commandType: CommandType.StoredProcedure);

            employeeValidationItem.ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>();
            employeeValidationItem.EmployeeAccount = multipleQueryResult.MapToSingle<EmployeeAccountItem>();

            if (employeeValidationItem.ValidationResponse == null) throw new NullReferenceException("validations object cannot be null.");

            return employeeValidationItem;

        }

        public AuthenticationResponse GetEmployeeByUserName(string userName)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_loginname", userName);


            using var multipleQueryResult = connection.QueryMultiple("[dbo].[GetUserByLoginName]", parameters, commandType: CommandType.StoredProcedure);

            return new AuthenticationResponse
            {
                ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                PasswordInfo = multipleQueryResult.MapToSingle<PasswordInfoItem>(),
                DashboardResponse = MapDashboardResponse(multipleQueryResult),
                AuthenticationType = multipleQueryResult.MapToSingle<AuthenticationType>()
            };

        }

        public ValidationResponse SetNewPassword(int accountID, string passwordHash, string passwordSalt)
        {


            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("in_useraccountid", accountID);
            parameters.Add("in_passwordhash", passwordHash);
            parameters.Add("in_passwordsalt", passwordSalt);

            ValidationResponse validationResponse = connection.QueryFirstOrDefault<ValidationResponse>("[dbo].[ResetPassword]", parameters, commandType: CommandType.StoredProcedure);

            if (validationResponse == null) throw new NullReferenceException("validations object cannot be null.");

            return validationResponse;

        }

        public ValidationResponse UpdatePassword(UpdatePasswordRequest request, string passwordHash, string passwordSalt, string updatePasswordToken)
        {

            _logger.LogInformation("UpdatePassword", request.LoginName);

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();

            parameters.Add("in_loginname", request.LoginName);
            parameters.Add("in_updatePasswordToken", updatePasswordToken);
            parameters.Add("in_passwordhash", passwordHash);
            parameters.Add("in_passwordsalt", passwordSalt);

            EmployeeValidationItem employeeValidationItem = new EmployeeValidationItem();

            ValidationResponse validationResponse = connection.QueryFirstOrDefault<ValidationResponse>("[dbo].[UpdatePassword]", parameters, commandType: CommandType.StoredProcedure);

            return validationResponse;

        }

        public void UpdateConfirmationCode(string empNo, string confirmationCode)
        {
            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("in_employeenumber", empNo);
            parameters.Add("in_confirmationcode", confirmationCode);

            try
            {
                connection.Execute("[dbo].[UpdateConfirmationCode]", parameters, commandType: CommandType.StoredProcedure);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public EmployeeValidationItem GetEmployeeByEmpNo(string employeeNumber)
        {
            _logger.LogInformation("GetEmployeeByEmpNo", employeeNumber);

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            var parameters = new DynamicParameters();

            parameters.Add("@in_employeenumber", employeeNumber);

            using var multipleQueryResult = connection.QueryMultiple("[dbo].[GetEmployeeByEmployeeNumber]", parameters, commandType: CommandType.StoredProcedure);

            EmployeeValidationItem employeeValidationItem = new EmployeeValidationItem
            {
                ValidationResponse = multipleQueryResult.MapToSingle<ValidationResponse>(),
                AuthenticationType = multipleQueryResult.MapToSingle<AuthenticationType>()
            };

            if (employeeValidationItem.ValidationResponse == null) throw new NullReferenceException("validations object cannot be null.");

            return employeeValidationItem;
        }

        public async Task<int> GetAuthenticationTypeAsync()
        {
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();

                return await connection.QueryFirstOrDefaultAsync<int>("SELECT dbo.GetAuthenticationTypeID()", commandType: CommandType.Text);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetMaxTriesResult() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        public ValidationResponse UpdateFailAttempCounts(TokenRequest request, bool validPassword)
        {
            try
            {
                _logger.LogInformation("UpdatePassword", request.LoginName);

                using var connection = new SqlConnection(connectionString);
                connection.Open();

                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();

                parameters.Add("in_loginname", request.LoginName);
                parameters.Add("in_devicename", request.DeviceName);
                parameters.Add("in_deviceid", request.DeviceID);
                parameters.Add("in_validpassword", validPassword);

                ValidationResponse validationResponse = connection.QueryFirstOrDefault<ValidationResponse>("[dbo].[UpdateLoginAttempts]", parameters, commandType: CommandType.StoredProcedure);

                if (validationResponse == null) throw new NullReferenceException("validations object cannot be null.");

                return validationResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetMaxTriesResult() Encountered Fatal Database Error => {ex.Message}");
                throw;
            }
        }

        public PasswordValidation GetPasswordValidation()
        {
            try
            {
                _logger.LogInformation("GetPasswordValidation");

                using var connection = new SqlConnection(connectionString);
                connection.Open();

                return connection.QueryFirstOrDefault<PasswordValidation>("[dbo].[PswValidatorParameters_Get]", commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #region private methods

        private void UpdatePasswordTokenOnDb(int accountID, string refreshToken, DateTime tokenExpiryTime)
        {

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Define the parameters for the stored procedure
            var parameters = new DynamicParameters();
            parameters.Add("in_useraccountid", accountID);
            parameters.Add("in_refreshtoken", refreshToken);
            parameters.Add("in_tokenexpiry", tokenExpiryTime);

            try
            {
                connection.Execute("[dbo].[RefreshToken_Upd]", parameters, commandType: CommandType.StoredProcedure);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EmployeeManager> GetEmployeeManagerDetails(string empNo)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@EmpNo", empNo);
                parameters.Add("@EmployeeManagerEmail", dbType: DbType.String, direction: ParameterDirection.Output, size: 50);
                parameters.Add("@EmployeeManagerName", dbType: DbType.String, direction: ParameterDirection.Output, size: 50);
                parameters.Add("@EmployeeName", dbType: DbType.String, direction: ParameterDirection.Output, size: 50);

                await connection.ExecuteAsync("GetEmployeeManagerDetails", parameters, commandType: CommandType.StoredProcedure);

                string employeeManagerEmail = parameters.Get<string>("@EmployeeManagerEmail");
                string employeeManagerName = parameters.Get<string>("@EmployeeManagerName");
                string employeeName = parameters.Get<string>("@EmployeeName");

                return new EmployeeManager
                {
                    EmployeeName = employeeName,
                    EmployeeManagerEmail = employeeManagerEmail,
                    EmployeeManagerName = employeeManagerName
                };
            }

            #endregion
        }
    }
}