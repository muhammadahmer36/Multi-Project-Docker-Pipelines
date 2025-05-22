using Dapper;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Test.Entities;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.Modules.Test.Repositories
{
    public interface IdapperTest
    {
        Task<List<UserLogins>> GetAllDataAsync();

        ValidationResponse GetValidation(string loginName, string deviceName, string deviceID);
    }
}
