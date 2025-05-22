using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Repositories;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public class TokenAuthenticationService : IAuthenticateService
    {
        #region Private Variables

        private readonly IUserManagementService _userManagementService;
        private readonly TokenManagement _tokenManagement;

        #endregion

        #region Constructor

        public TokenAuthenticationService(IUserManagementService service, IOptions<TokenManagement> tokenManagement)
        {
            _userManagementService = service;
            _tokenManagement = tokenManagement.Value;
        }

        #endregion

        #region Public Methods

        public bool IsAuthenticated(String password, string deviceName, string deviceID, PasswordInfoItem pwdItem, out string accessToken, out string refreshToken)
        {
            accessToken = string.Empty;
            refreshToken = string.Empty;

            if (!_userManagementService.IsValidPassword(password, pwdItem)) return false;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, pwdItem.UserAccountID.ToString()),
                new Claim(ClaimTypes.SerialNumber, deviceID),
                new Claim(ClaimTypes.UserData, deviceName)
            }.ToList();

            accessToken = GenerateAccessToken(claims);
            refreshToken = GenerateRefreshToken();

            return true;
        }

        public int GetAccountIDFromExpiredToken(string tokenStr)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenManagement.Secret)),
                ValidateLifetime = false //Ignore the token's expiration date
            };

            var token = tokenStr.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (!(securityToken is JwtSecurityToken jwtSecurityToken) || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return Misc.GetUserAccountID(tokenStr);
        }

        public RefreshTokenResponse GetRefreshToken(string accessToken)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = jwtHandler.ReadJwtToken(accessToken);
            List<Claim> claims = (List<Claim>)token.Claims;
            RefreshTokenResponse item = new RefreshTokenResponse
            {
                AccessToken = GenerateAccessToken(claims),
                RefreshToken = GenerateRefreshToken()
            };

            return item;
        }

        #endregion

        #region Private Helper Methods

        private string GenerateAccessToken(List<Claim> claimsAr)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenManagement.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                issuer: _tokenManagement.Issuer,
                audience: _tokenManagement.Audience,
                claims: claimsAr,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(_tokenManagement.AccessExpiration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public RefreshTokenResponse GenerateTokenAndRefreshToken(PasswordInfoItem pwdItem, string deviceID, string deviceName)
        {

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, pwdItem.UserAccountID.ToString()),
                new Claim(ClaimTypes.SerialNumber, deviceID),
                new Claim(ClaimTypes.UserData, deviceName)
            }.ToList();

            return new RefreshTokenResponse
            {
               AccessToken = GenerateAccessToken(claims),
               RefreshToken = GenerateRefreshToken()
            };
        }

        #endregion
    }
}