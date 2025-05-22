using System.Collections.Generic;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public interface IPasswordConfigurationRepository: IPasswordConfigurationCache
    {
        IEnumerable<PasswordInfoItem> GetPreviousPasswordsByLoginName(string loginName);
    }
}