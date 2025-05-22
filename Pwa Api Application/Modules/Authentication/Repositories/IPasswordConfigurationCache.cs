using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Services;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public interface IPasswordConfigurationCache
    {
        PasswordValidation GetPasswordValidation();
    }
}