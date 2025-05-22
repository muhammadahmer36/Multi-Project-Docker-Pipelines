using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Geofencing.Entities;
using EcotimeMobileAPI.Modules.Geofencing.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace EcotimeMobileAPI.Filters.Attributes
{
    public class GeofenceAuthorizationAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            IGeofencingEnableRepository geofencingRepo = context.HttpContext.RequestServices.GetService<IGeofencingRepository>();
            IGetAppMessageCache messageCache = context.HttpContext.RequestServices.GetService<IAppMessagesRepository>() as IGetAppMessageCache;

            bool IsGeofenceEnable = geofencingRepo.IsGeofencingEnabled();

            if (IsGeofenceEnable) return;

            context.Result = new OkObjectResult(new ApiResponseModel<string>
            {
                Validation = messageCache.GetAppMessageById(eErrorMessageCode.GeofenceIsNotEnabled)
            });
        }
    }
}