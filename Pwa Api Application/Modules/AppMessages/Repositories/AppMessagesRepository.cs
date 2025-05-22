using Dapper;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Modules.AppMessages.Repositories
{
    public class AppMessagesRepository : IAppMessagesRepository
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AuthenticationRepository> _logger;
        private readonly string _connectionString;

        public AppMessagesRepository(IConfiguration config, ILogger<AuthenticationRepository> logger)
        {
            _config = config;
            _logger = logger;
            _connectionString = _config.GetConnectionString("HBSData");
        }

        public IEnumerable<ValidationResponse> GetAllAppMessages()
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            IEnumerable<ValidationResponse> appMessages = connection.Query<ValidationResponse>("dbo.[GetAppMessages]", param: null, commandType: CommandType.StoredProcedure);
                
            return appMessages;
        }
    }
}
