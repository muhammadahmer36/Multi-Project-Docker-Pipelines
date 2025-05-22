using System;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class PasswordInfoItem
    {
        public int UserAccountID { get; set; }

        public String PasswordHash { get; set; }

        public String PasswordSalt { get; set; }
    }
}