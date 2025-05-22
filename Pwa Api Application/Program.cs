using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using EcotimeMobileAPI.Observers;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.AlertControl.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var hostBuilder = CreateHostBuilder(args).Build();//.LoadCahe(TimeSpan.FromMinutes(2)).Run();
            _ = Task.Run(() => ReloadCache(hostBuilder.Services));
            hostBuilder.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .UseSerilog((context, configuration) => { configuration.ReadFrom.Configuration(context.Configuration); })
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });

        private static void ReloadCache(IServiceProvider services)
        {
            using var scopedService = services.CreateScope();
            var logger = scopedService.ServiceProvider.GetRequiredService<ILogger<CacheRefreshObserver>>();
            var appMessagesCache = scopedService.ServiceProvider.GetRequiredService<IAppMessagesRepository>() as AppMessagesCache;
            var alertControlCache = scopedService.ServiceProvider.GetRequiredService<IAlertControlRepository>() as AlertControlCache;
            var passConfigCache = scopedService.ServiceProvider.GetRequiredService<PasswordConfigurationCache>();
            new CacheRefreshObserver(logger, appMessagesCache, passConfigCache, alertControlCache).LoadAllCache();
        }
    }
}