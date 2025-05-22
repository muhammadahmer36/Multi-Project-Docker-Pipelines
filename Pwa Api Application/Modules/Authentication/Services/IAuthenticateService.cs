using EcotimeMobileAPI.Modules.Authentication.Entities;
using System;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public interface IAuthenticateService
    {
        bool IsAuthenticated(String password, string deviceName, string deviceID, PasswordInfoItem pwdItem, out string token, out string refreshToken);

        int GetAccountIDFromExpiredToken(string tokenStr);

        RefreshTokenResponse GetRefreshToken(string accessToken);

        RefreshTokenResponse GenerateTokenAndRefreshToken(PasswordInfoItem pwdItem, string deviceID, string deviceName);
    }
}