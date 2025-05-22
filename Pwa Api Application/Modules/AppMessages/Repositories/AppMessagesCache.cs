using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.CommonClasses.Interfaces;
using EcotimeMobileAPI.CommonClasses.Application;

namespace EcotimeMobileAPI.Modules.AppMessages.Repositories
{
    public class AppMessagesCache : IGetAppMessageCache, IAppMessagesRepository, IRefreshCache
    {
        private readonly TimeSpan _cacheTimespan;
        private readonly IMemoryCache _memoryCache;
        private readonly IAppMessagesRepository _appMessagesRepository;
        private readonly IApplicationConfiguration _applicationConfiguration;

        public AppMessagesCache(IAppMessagesRepository appMessagesRepository, IMemoryCache memoryCache, IApplicationConfiguration applicationConfiguration)
        {
            _memoryCache = memoryCache;
            _appMessagesRepository = appMessagesRepository;
            _applicationConfiguration = applicationConfiguration;
            _cacheTimespan = TimeSpan.FromMinutes(_applicationConfiguration.CacheTimeInMinute);
        }

        public ValidationResponse GetAppMessageById(eErrorMessageCode errorMessageCode)
        {
            return GetAllAppMessages()
                .Where(x => x.StatusCode == (int) errorMessageCode)
                .Select(x => new ValidationResponse { StatusCode = x.StatusCode , StatusMessage = x.StatusMessage})
                .FirstOrDefault();
        }

        public IEnumerable<ValidationResponse> GetAllAppMessages()
        {
           
            var appmessage = _memoryCache.Get<IEnumerable<ValidationResponse>>(Constants.AppMessagesCacheKey);

            if (appmessage == null || appmessage.Count() == 0)
            {
                CreateCache();
                appmessage = _memoryCache.Get<IEnumerable<ValidationResponse>>(Constants.AppMessagesCacheKey);
            }

            return appmessage;
        }

        private void CreateCache()
        {
            _memoryCache.Set(Constants.AppMessagesCacheKey, _appMessagesRepository.GetAllAppMessages(), new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = _cacheTimespan
            });
        }

        public void RefreshCache()
        {
            _memoryCache.Remove(Constants.AppMessagesCacheKey);
            CreateCache();
        }
    }
}
