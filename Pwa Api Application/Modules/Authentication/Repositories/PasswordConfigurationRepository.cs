using Dapper;
using System;
using System.Data;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public class PasswordConfigurationRepository: IPasswordConfigurationRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<PasswordConfigurationRepository> _logger;
        public PasswordConfigurationRepository(IConfiguration config, ILogger<PasswordConfigurationRepository> logger)
        {
            _logger = logger;
            _connectionString = config.GetConnectionString("HBSData");
        }

        public PasswordValidation GetPasswordValidation()
        {
            try
            {
                _logger.LogInformation("GetPasswordValidation");

                using var connection = new SqlConnection(_connectionString);
                connection.Open();  

                return connection.QueryFirstOrDefault<PasswordValidation>("[dbo].[PswValidatorParameters_Get]", commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public IEnumerable<PasswordInfoItem> GetPreviousPasswordsByLoginName(string loginName)
        {
            try
            {
                _logger.LogInformation("GetPreviousPasswordsByLoginName() {@loginname}", loginName) ;

                using var connection = new SqlConnection(_connectionString);
                connection.Open();
                var parameters = new DynamicParameters();
                parameters.Add("in_loginname", loginName);

                return connection.Query<PasswordInfoItem>("[dbo].[GetPreviousPasswordsByLoginName]", parameters, commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                _logger.LogInformation("GetPreviousPasswordsByLoginName9) {@ex}", ex);
                throw;
            }
        }
    }
}
