using System.Collections.Generic;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.Modules.AppMessages.Repositories
{
    public interface IAppMessagesRepository
    {
        IEnumerable<ValidationResponse> GetAllAppMessages();
    }
}
