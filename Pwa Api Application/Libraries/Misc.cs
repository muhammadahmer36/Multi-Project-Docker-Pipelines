using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.Libraries
{
    public class Misc
    {
        #region Authentication

        // Create and return a random salt string
        public static byte[] GetRandomSalt(int length)
        {
            using var random = new RNGCryptoServiceProvider();
            byte[] salt = new byte[length];
            random.GetNonZeroBytes(salt);
            return salt;
        }

        // Create and return a password with salt
        public static byte[] GetSaltedHashPassword(byte[] password, byte[] salt)
        {
            using HashAlgorithm algorithm = new SHA256Managed();
            byte[] plainTextWithSaltBytes = new byte[password.Length + salt.Length];

            for (int i = 0; i < password.Length; i++)
                plainTextWithSaltBytes[i] = password[i];

            for (int i = 0; i < salt.Length; i++)
                plainTextWithSaltBytes[password.Length + i] = salt[i];

            return algorithm.ComputeHash(plainTextWithSaltBytes);
        }

        // Generate Temporary Password
        public static string GenerateTempPassword(int length)
        {
            return Convert.ToBase64String(GetRandomSalt(length));
        }

        private static string GetHashCode(byte[] valueBytes)
        {
            using HashAlgorithm algorithm = new SHA256Managed();
            return Convert.ToBase64String(algorithm.ComputeHash(valueBytes));
        }

        public static string GenerateTempCode(int length)
        {
            var randomNumber = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber); 
            return Convert.ToBase64String(randomNumber);
        }

        public static string GenerateUpdatePasswordHash(string password)
        {
            return GetHashCode(Encoding.ASCII.GetBytes(password));
        }

        public static string HideEmail(string email)
        {
            ReadOnlySpan<char> emailSpan = email.AsSpan();
            string convertedEmail = $"{new String(emailSpan.Slice(0, 3))}*****{new String(emailSpan.Slice(email.Length-6))}" ;
            return convertedEmail;
        }

        //// Get Login ID from Authentication Token
        //public static string GetLoginID(string tokenStr)
        //{
        //    return GetClaimValue(tokenStr, ClaimTypes.Name);
        //}

        // Get UserAccountID from Authentication Token
        public static int GetUserAccountID(string tokenStr)
        {
            return Convert.ToInt32(GetClaimValue(tokenStr, ClaimTypes.NameIdentifier));
        }

        public static string GetEmployeeNumber(string tokenStr)
        {
            return GetClaimValue(tokenStr, Constants.EmployeeNumber);
        }

        // Get DeviceID from Authentication Token
        public static string GetDeviceID(string tokenStr)
        {
            return GetClaimValue(tokenStr, ClaimTypes.SerialNumber);
        }

        // Get DeviceName from Authentication Token
        public static string GetDeviceName(string tokenStr)
        {
            return GetClaimValue(tokenStr, ClaimTypes.UserData);
        }

        // Get Claim Value From Token Claim
        public static string GetClaimValue(string tokenStr, string claimType)
        {
            var token = tokenStr.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            var handler = new JwtSecurityTokenHandler();
            var tokenObj = handler.ReadJwtToken(token);

            return tokenObj.Claims
                .Where(clm => clm.Type == claimType)
                .Select(hdr => hdr.Value)
                .FirstOrDefault();
        }

        public static string GetHeaderValue(string tokenStr, string headerName)
        {
            var token = tokenStr.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            var handler = new JwtSecurityTokenHandler();
            var tokenObj = handler.ReadJwtToken(token);

            return tokenObj.Header
                .Where(hdr => hdr.Key == headerName) 
                .Select(hdr => hdr.Value as string)
                .FirstOrDefault();
        }

        #endregion

        public static bool IsPasswordValid(PasswordValidation passwordValidation, string password, out string errorMsg)
        {

            if (passwordValidation is null) throw new ArgumentNullException("passwordValidation");

            StringBuilder _stringBuilder = new StringBuilder();

            bool IsPasswordValid = true;

            if (password.Length < passwordValidation.MinPwdLength)
            {
                _stringBuilder.Append($" minimum {passwordValidation.MinPwdLength} characters,");
                IsPasswordValid = false;
            }

            if (password.Length > passwordValidation.MaxPwdLength)
            {
                _stringBuilder.Append($" maximum {passwordValidation.MaxPwdLength} characters,");
                IsPasswordValid = false;
            }

            if (passwordValidation.MinNoOfDigits > 0 && password.Count(char.IsDigit) < passwordValidation.MinNoOfDigits)
            {
                _stringBuilder.Append($" at least {passwordValidation.MinNoOfDigits} digits,");
                IsPasswordValid = false;
            }

            if (passwordValidation.MinNoOfSpecialCharacter > 0 && password.Count(IsSpecialCharacter) < passwordValidation.MinNoOfSpecialCharacter)
            {
                _stringBuilder.Append($" at least {passwordValidation.MinNoOfSpecialCharacter} special characters,");
                IsPasswordValid = false;
            }

            if (!string.IsNullOrEmpty(passwordValidation.NotAllowedCharacters) && passwordValidation.NotAllowedCharacters.Any(c => password.Contains(c)))
            {
                _stringBuilder.Append($" should not contains these {passwordValidation.MaxPwdLength} characters,");
                IsPasswordValid = false;
            }

            errorMsg = _stringBuilder.ToString();

            if (errorMsg.Length > 0) errorMsg = $"{errorMsg.Remove(errorMsg.LastIndexOf(','))}.";

            return IsPasswordValid;
        }

        private static bool IsSpecialCharacter(char c)
        {
            return !char.IsLetterOrDigit(c);
        }

        public static string GetTemplateBody(string filePath)
        {
            string templateBody = string.Empty;

            try
            {
                using StreamReader streamReader = new StreamReader(filePath);
                templateBody = streamReader.ReadToEnd();
            }
            catch (Exception)
            {
                throw;
            }

            return templateBody;
        }


    }
}