using System;
using Microsoft.Extensions.Caching.Memory;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Interfaces;
using EcotimeMobileAPI.CommonClasses.Application;
using EcotimeMobileAPI.Modules.Authentication.Entities;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public class PasswordConfigurationCache : IPasswordConfigurationCache, IRefreshCache
    {
        private readonly TimeSpan _cacheTimespan;
        private readonly IMemoryCache _memoryCache;
        private readonly IPasswordConfigurationRepository _passwordConfigurationRepository;
        private readonly IApplicationConfiguration _applicationConfiguration;

        public PasswordConfigurationCache(IPasswordConfigurationCache passwordConfigurationRepository, 
            IMemoryCache memoryCache, IApplicationConfiguration applicationConfiguration)
        {
            _memoryCache = memoryCache;
            _passwordConfigurationRepository = passwordConfigurationRepository as IPasswordConfigurationRepository;
            _applicationConfiguration = applicationConfiguration;
            _cacheTimespan = TimeSpan.FromMinutes(_applicationConfiguration.CacheTimeInMinute);
        }

        private void CreateCache()
        {
            _memoryCache.Set(Constants.PasswordConfigCacheKey, _passwordConfigurationRepository.GetPasswordValidation(), new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = _cacheTimespan
            });
        }

        public PasswordValidation GetPasswordValidation()
        {
            PasswordValidation passwordValidation = _memoryCache.Get<PasswordValidation>(Constants.PasswordConfigCacheKey);

            if (passwordValidation == null)
            {
                CreateCache();
                passwordValidation = _memoryCache.Get<PasswordValidation>(Constants.PasswordConfigCacheKey);
            }

            return new PasswordValidation
            {
               MinPwdLength = passwordValidation.MinPwdLength,
               MaxPwdLength = passwordValidation.MaxPwdLength,
               MinNoOfDigits = passwordValidation.MinNoOfDigits,
               NotAllowedCharacters = passwordValidation.NotAllowedCharacters,
               MinNoOfSpecialCharacter = passwordValidation.MinNoOfSpecialCharacter
            };
        }

        public void RefreshCache()
        {
            _memoryCache.Remove(Constants.PasswordConfigCacheKey);
            CreateCache();
        }
    }
}
