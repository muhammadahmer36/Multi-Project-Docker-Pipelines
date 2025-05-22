using System.Threading.Tasks;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public interface IAuthenticationRepository : IStoredProcRepository
    {
        AuthenticationResponse Authenticate(TokenRequest request);
        void UpdateRefreshTokenOnDb(int accountID, string refreshToken);
        void UpdatePasswordTokenOnDb(int accountID, string refreshToken);
        void UpdateConfirmationCode(string empNo, string confirmationCode);
        ValidationResponse GetValidationResponseByStatusCode(int statusCode);
        RefreshTokenItem GetRefreshToken(int accountID);
        ValidationResponse UpdateFailAttempCounts(TokenRequest request, bool isValidPassword);

        EmployeeValidationItem ValidateEmployeeByEmpNo(string employeeNumber);
        EmployeeValidationItem GetEmployeeByEmpNo(string employeeNumber);
        EmployeeValidationItem ValidateEmployeeByUserName(string userName);
        AuthenticationResponse GetEmployeeByUserName(string userName);

        ValidationResponse RegisterAccount(RegistrationRequest request, string passwordHash, string passwordSalt, string confirmationCode, bool isEmailConfirmed = false);

        ValidationResponse UpdatePassword(UpdatePasswordRequest request, string passwordHash, string passwordSalt, string updatePasswordHash);
        ValidationResponse SetNewPassword(int accountID, string passwordHash, string passwordSalt);

        ValidationResponse ConfirmAccount(ConfirmRegistrationRequest request);
        Task<int> GetAuthenticationTypeAsync();
        Task<EmployeeManager> GetEmployeeManagerDetails(string empNo);


    }
}