using System;
using System.Text;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public class UserManagementService : IUserManagementService
    {
        public bool IsValidPassword(String input_password, PasswordInfoItem pwdItem)
        {
            string proposed_hashed_password = Convert.ToBase64String(Misc.GetSaltedHashPassword(Encoding.ASCII.GetBytes(input_password), Convert.FromBase64String(pwdItem.PasswordSalt)));
            return proposed_hashed_password.Equals(pwdItem.PasswordHash);
        }
    }
}