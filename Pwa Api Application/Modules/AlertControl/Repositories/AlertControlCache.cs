using System;
using Microsoft.Extensions.Caching.Memory;
using EcotimeMobileAPI.CommonClasses;
using Microsoft.Extensions.Configuration;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.CommonClasses.Interfaces;
using EcotimeMobileAPI.CommonClasses.Application;

namespace EcotimeMobileAPI.Modules.AlertControl.Repositories
{
    public class AlertControlCache : IRefreshCache , IAlertControlRepository
    {
        private readonly TimeSpan _cacheTimespan;
        private readonly IMemoryCache _memoryCache;
        private readonly IAlertControlRepository _alertControlRepository;
        private readonly IApplicationConfiguration _applicationConfiguration;
        private readonly IEmailConfiguration _emailConfiguration;

        public AlertControlCache(IAlertControlRepository alertControlRepository, IMemoryCache memoryCache, IApplicationConfiguration applicationConfiguration, IEmailConfiguration emailConfiguration)
        {
            _memoryCache = memoryCache;
            _alertControlRepository = alertControlRepository;
            _applicationConfiguration = applicationConfiguration;
            _emailConfiguration = emailConfiguration;
            _cacheTimespan = TimeSpan.FromMinutes(_applicationConfiguration.CacheTimeInMinute);
        }

        public IEmailConfiguration GetAlertControl()
        {
            var alertControl = _memoryCache.Get<IEmailConfiguration>(Constants.AlertControlCacheKey);
            if (alertControl == null)
            {
                CreateCache();
                alertControl = _memoryCache.Get<IEmailConfiguration>(Constants.AlertControlCacheKey);
            }
            return new EmailConfiguration
            {
                SmtpServer = alertControl.SmtpServer,
                SmtpPort = alertControl.SmtpPort,
                SmtpUsername = alertControl.SmtpUsername,
                SmtpPassword = alertControl.SmtpPassword,
                SmtpFromAddress = alertControl.SenderEmail,
                SenderEmail = alertControl.SenderEmail,
                EmailFooter = alertControl.EmailFooter,
                AuditLifetime = alertControl.AuditLifetime,
                SmtpTimeout = alertControl.SmtpTimeout,
                PoolInterval = alertControl.PoolInterval,
                NoOfTries = alertControl.NoOfTries,
                TestMode = alertControl.TestMode,
                SupportEmailAddress = alertControl.TestRecipientEmailAddress,
                AuditMode = alertControl.AuditMode,
                TestRecipientEmailAddress = alertControl.TestRecipientEmailAddress,
                PopPort = _emailConfiguration.PopPort,
                PopUsername = _emailConfiguration.PopUsername,
                PopPassword = _emailConfiguration.PopPassword,
                SmtpSecureSocketOption = _emailConfiguration.SmtpSecureSocketOption,
                SmtpDomain = _emailConfiguration.SmtpDomain,
                PopServer = _emailConfiguration.PopServer,
                MaxFailCount = _emailConfiguration.MaxFailCount,
                SmtpFromName = _emailConfiguration.SmtpFromName,
                IsAuthenticationRequired = _emailConfiguration.IsAuthenticationRequired
            };
        }

        private void CreateCache()
        {
            _memoryCache.Set(Constants.AlertControlCacheKey, _alertControlRepository.GetAlertControl(), new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = _cacheTimespan
            });
        }

        public void RefreshCache()
        {
            _memoryCache.Remove(Constants.AlertControlCacheKey);
            CreateCache();
        }
    }
}
