using System;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public class RefreshTokenItem
    {
        public string RefreshToken { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}