using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.CommonClasses;

namespace EcotimeMobileAPI.Filters.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try 
            { 
                await _next(context);

                await RedirectResponse(context, (HttpStatusCode)context.Response.StatusCode);
            }
            catch (System.Exception error)
            {

                _logger.LogError("Exception From ExceptionHandlerMiddleware {@error}", error);
                context.Response.StatusCode = (int) System.Net.HttpStatusCode.InternalServerError;
                await context.Response.WriteAsJsonAsync(new ApiResponseModel<string[]>
                {
                    Validation = new CommonClasses.Entities.ValidationResponse
                    {
                        StatusCode = -500,
                        StatusMessage = "Something went wrong"
                    },
                    HttpStatusCode = System.Net.HttpStatusCode.InternalServerError,
                    Data = new[] { error.Message, error.HResult.ToString() }
                });

            }
        }

        private async Task RedirectResponse(HttpContext context, HttpStatusCode httpStatusCode)
        {
            string statusCodeMessage = httpStatusCode switch
            {
                HttpStatusCode.NotFound => "Not Found.",
                HttpStatusCode.MethodNotAllowed => "Method Not Allowed.",
                _ => string.Empty
            };

            if (string.IsNullOrEmpty(statusCodeMessage)) return;
          
            await context.Response.WriteAsJsonAsync(new ApiResponseModel<dynamic>
            {
                Validation = new CommonClasses.Entities.ValidationResponse
                {
                    StatusCode = (int)(eErrorMessageCode.UnhandleMessagecode) * (int)httpStatusCode,
                    StatusMessage = statusCodeMessage,
                },
                HttpStatusCode = httpStatusCode,
                Data = default
            });
        }
    }
}
