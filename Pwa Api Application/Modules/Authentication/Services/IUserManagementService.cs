using EcotimeMobileAPI.Modules.Authentication.Entities;
using System;

namespace EcotimeMobileAPI.Modules.Authentication.Services
{
    public interface IUserManagementService
    {
        bool IsValidPassword(String input_password, PasswordInfoItem pwdItem);
    }
}