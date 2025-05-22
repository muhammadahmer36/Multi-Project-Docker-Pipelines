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
using EcotimeMobileAPI.CommonClasses.Email;

namespace EcotimeMobileAPI.Modules.AlertControl.Repositories
{
    public class AlertControlRepository : IAlertControlRepository
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AlertControlRepository> _logger;
        private readonly string _connectionString;

        public AlertControlRepository(IConfiguration config, ILogger<AlertControlRepository> logger)
        {
            _config = config;
            _logger = logger;
            _connectionString = _config.GetConnectionString("HBSData");
        }

        public IEmailConfiguration GetAlertControl()
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            IEmailConfiguration alertControl = connection.QueryFirstOrDefault<EmailConfiguration>("dbo.[GetAlertControl]", param: null, commandType: CommandType.StoredProcedure);
                
            return alertControl;
        }
    }
}
