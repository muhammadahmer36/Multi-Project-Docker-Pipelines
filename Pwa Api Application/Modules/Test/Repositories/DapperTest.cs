using Dapper;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Test.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.Modules.Test.Repositories
{
    public class DapperTest : IdapperTest
    {
        private string connectionString;
        private readonly IConfiguration _config;
        public DapperTest()
        {
        }

        public DapperTest(IConfiguration config)
        {
            _config = config;
        }

        public async Task<List<UserLogins>> GetAllDataAsync()
        {
            connectionString = _config.GetConnectionString("HBSData");
            using IDbConnection connection = new SqlConnection(connectionString);
            string query = "select * from [dbo].[UserLogins]";
            IEnumerable<UserLogins> result = await connection.QueryAsync<UserLogins>(query);
            return result.ToList();
        }

        public ValidationResponse GetValidation(string loginName, string deviceName, string deviceID)
        {
            connectionString = _config.GetConnectionString("HBSData");

            using (var connection = new SqlConnection(connectionString))
            {
                // Open the connection
                connection.Open();

                // Define the parameters for the stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("in_loginname", loginName);
                parameters.Add("in_devicename", deviceName);
                parameters.Add("in_deviceid", deviceID);

                // Call the stored procedure
                IEnumerable<ValidationResponse> res = connection.Query<ValidationResponse>("[dbo].[UserAuth]", parameters, commandType: CommandType.StoredProcedure);

                ValidationResponse validation = (ValidationResponse)res.ToList()[0];

                return validation;

            }
        }

    }
}
