using System;
using System.Threading.Tasks;
using EcotimeMobileAPI.CommonClasses.BaseClasses;
using EcotimeMobileAPI.CommonClasses.Interfaces;
using Microsoft.Extensions.Logging;

namespace EcotimeMobileAPI.Observers
{
    public class CacheRefreshObserver: Observable<IRefreshCache>
    {
        private readonly ILogger<CacheRefreshObserver> _logger;

        public CacheRefreshObserver(ILogger<CacheRefreshObserver> logger, params IRefreshCache[] refreshCaches) 
        {
           _logger = logger;
           Subscribe(refreshCaches);
        }

        public void LoadAllCache()
        {
            try 
            {
                _logger.LogInformation("caching for this time {@cacheTimeSpan}");
                Parallel.ForEach(_subscribers, new ParallelOptions { MaxDegreeOfParallelism = NoOfSubscribers > 3 ? 3 : NoOfSubscribers }, (subscriber, i) =>
                {
                    _logger.LogInformation("initiating caching for {@subscriber} at {@i}", subscriber, i);

                    subscriber.RefreshCache();
                });
                
                Dispose();
            } 
            catch (Exception ex) 
            {
                _logger.LogInformation("error on LoadAllCache {@ex}", ex);
            }
        }
    }
}
