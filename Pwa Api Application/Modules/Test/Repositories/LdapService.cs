using System;
using System.Web;
using System.DirectoryServices;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.CommonClasses.Ldap;

namespace EcotimeMobileAPI.Modules.Test.Repositories
{
    public class LdapService : IldapService
    {
        private readonly ILogger<LdapService> _logger;
        private readonly ILdapConfiguration _ldapConfiguration;

        public LdapService()
        {
        }

        public LdapService(ILdapConfiguration ldapConfiguration, ILogger<LdapService> logger)
        {
            _logger = logger;
            _ldapConfiguration = ldapConfiguration;
        }

        /// <summary>
        /// Validates the provided username and password against Active Directory and returns the employee number if valid.
        /// </summary>
        /// <param name="username">The username to validate.</param>
        /// <param name="password">The password to validate.</param>
        /// <returns>The employee number associated with the validated user, or an empty string if invalid.</returns>
        public string CheckUserNameAndPassword(string username, string password, string domainName)
        {

            _logger.LogInformation("CheckUserNameAndPassword {@_ldapConfiguration}", _ldapConfiguration);

            // Combine the username with the LDAP domain name
            var fullUsername = string.IsNullOrEmpty(domainName) ? $"{_ldapConfiguration.ldapDomainName}{username}" : $"{domainName}\\{username}";

            _logger.LogInformation("CheckUserNameAndPassword {@username}, {@password}, {@domainName}, {@fullUsername}", username, password, domainName, fullUsername);

            // Create a DirectoryEntry using the provided LDAP path, full username, and password
            using (var entry = new DirectoryEntry(_ldapConfiguration.path, fullUsername, password))
            {
                string exMessage = string.Empty;
                try
                {
                    // Get attribute values from the entry using the provided attributes and query parameter
                    Dictionary<string, object> values = GetAttributesValue(entry, _ldapConfiguration.queryParam, username, _ldapConfiguration.attributes.Split(','));

                    // Check if the values contain an "employeenumber" attribute
                    if (values != null && values.Count > 0 && values.ContainsKey("employeenumber")) return values["employeenumber"] as string;

                }
                catch (Exception ex)
                {
                    _logger.LogInformation("CheckUserNameAndPassword Exception: {@ex}", ex);
                    throw;
                }

                return exMessage;
            }
        }

        /// <summary>
        /// Retrieves attribute values from Active Directory for a given user.
        /// </summary>
        /// <param name="directoryEntry">The DirectoryEntry object for the user.</param>
        /// <param name="queryParameter">The attribute to query (e.g., "sAMAccountName").</param>
        /// <param name="queryParameterValue">The value to query for.</param>
        /// <param name="attributes">Attributes to retrieve values for.</param>
        /// <returns>A dictionary containing attribute names and their values.</returns>
        public Dictionary<string, object> GetAttributesValue(DirectoryEntry directoryEntry, string queryParameter, string queryParameterValue, params string[] attributes)
        {
            // Dictionary to hold attribute name-value pairs
            _logger.LogInformation("GetAttributesValue {@queryParameter}, {@queryParameterValue}", queryParameter, queryParameterValue);

            Dictionary<string, object> valuePairs = new Dictionary<string, object>();

            // Create a DirectorySearcher using the provided DirectoryEntry
            using DirectorySearcher directorySearcher = new DirectorySearcher(directoryEntry);

            // Create a filter using the query parameter and its value
            directorySearcher.Filter = $"({queryParameter}={HttpUtility.HtmlEncode(queryParameterValue)})";

            // Load the specified attributes for the search
            LoadAttributeParameters(directorySearcher, attributes);

            try
            {
                // Perform the search and retrieve the first result
                SearchResult searchResult = directorySearcher.FindOne();

                // If no result is found, return the empty dictionary
                if (searchResult == null) return valuePairs;

                // Iterate through the specified attributes and add them to the dictionary
                foreach (string attribute in attributes)
                {
                    valuePairs.Add(attribute, searchResult.Properties[attribute][0]);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation("GetAttributesValue Exception: {@ex}", ex);
                throw;
            }

            return valuePairs;
        }

        /// <summary>
        /// Loads the specified attributes for the DirectorySearcher.
        /// </summary>
        /// <param name="directorySearcher">The DirectorySearcher to load attributes for.</param>
        /// <param name="attributes">Attributes to load.</param>
        private void LoadAttributeParameters(DirectorySearcher directorySearcher, params string[] attributes)
        {
            foreach (string attribute in attributes)
            {
                directorySearcher.PropertiesToLoad.Add(attribute);
            }
        }

    }
}
