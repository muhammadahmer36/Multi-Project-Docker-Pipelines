using Serilog;
using AutoMapper;
using System;
using System.IO;
using System.Net;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using EcotimeMobileAPI.CommonClasses.Ldap;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.Filters.Middlewares;
using EcotimeMobileAPI.Libraries.Geofencing;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.Modules.Test.Contexts;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Common.Contexts;
using EcotimeMobileAPI.Modules.TimeOff.Contexts;
using EcotimeMobileAPI.Modules.Balances.Contexts;
using EcotimeMobileAPI.Modules.Test.Repositories;
using EcotimeMobileAPI.CommonClasses.Application;
using EcotimeMobileAPI.Modules.Timesheet.Contexts;
using EcotimeMobileAPI.Modules.Common.Repositories;
using EcotimeMobileAPI.Modules.Geofencing.Contexts;
using EcotimeMobileAPI.Modules.TimePunches.Contexts;
using EcotimeMobileAPI.Modules.AppMessages.Contexts;
using EcotimeMobileAPI.Modules.TimeOff.Repositories;
using EcotimeMobileAPI.Modules.Balances.Repositories;
using EcotimeMobileAPI.Modules.Timesheet.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Contexts;
using EcotimeMobileAPI.Modules.Authentication.Services;
using EcotimeMobileAPI.Modules.Geofencing.Repositories;
using EcotimeMobileAPI.Modules.TimePunches.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Services.Saml;
using EcotimeMobileAPI.Modules.Notifications.Contexts;
using EcotimeMobileAPI.Modules.Notification.Repositories;
using EcotimeMobileAPI.Modules.AlertControl.Repositories;
using EcotimeMobileAPI.Modules.AlertControlContext.Contexts;


namespace EcotimeMobileAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the dependency injection container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddScoped<IAuthenticateService, TokenAuthenticationService>();
            services.AddScoped<IUserManagementService, UserManagementService>();

            services.AddDbContext<AppMessagesContext>();
            services.AddDbContext<AlertControlContext>();
            services.AddDbContext<LoginItemContext>();
            services.AddDbContext<AuthenticationContext>();
            services.AddDbContext<TimePunchesContext>();
            services.AddDbContext<BalancesContext>();
            services.AddDbContext<CommonContext>();
            services.AddDbContext<TimeOffContext>();
            services.AddDbContext<TimesheetContext>();
            services.AddDbContext<TestContext>();
            services.AddDbContext<GeofencingContext>();
            services.AddDbContext<NotificationContext>();

            services.AddScoped<ILoginItemsRepository, LoginItemsRepository>();
            services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
            services.AddScoped<ITimePunchesRepository, TimePunchesRepository>();
            services.AddScoped<IBalancesRepository, BalancesRepository>();
            services.AddScoped<ICommonRepository, CommonRepository>();
            services.AddScoped<ITimeOffRepository, TimeOffRepository>();
            services.AddScoped<IGeofencingRepository, GeofencingRepository>();
            services.AddScoped<ITimesheetRepository, TimesheetRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<ITestRepo, TestRepo>();
            services.AddScoped<IdapperTest, DapperTest>();
            services.AddScoped<IPasswordConfigurationRepository, PasswordConfigurationRepository>();
            services.AddScoped<IGeofencing, Geofencing>();
            services.AddScoped<ISamlService, SamlService>();


            services.AddScoped(x => new AppMessagesRepository(Configuration, x.GetRequiredService<ILogger<AuthenticationRepository>>()));
            services.AddScoped(x => new AlertControlRepository(Configuration, x.GetRequiredService<ILogger<AlertControlRepository>>()));
            services.AddScoped<IAppMessagesRepository>(x => new AppMessagesCache
                (x.GetRequiredService<AppMessagesRepository>(), x.GetRequiredService<IMemoryCache>(), Configuration.GetSection("ApplicationConfiguration").Get<ApplicationConfiguration>()));
            services.AddScoped<IAlertControlRepository>(x => new AlertControlCache
                (x.GetRequiredService<AlertControlRepository>(), x.GetRequiredService<IMemoryCache>(), Configuration.GetSection("ApplicationConfiguration").Get<ApplicationConfiguration>(), Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>()));

            services.AddScoped(x => new PasswordConfigurationCache(x.GetRequiredService<IPasswordConfigurationRepository>(), x.GetRequiredService<IMemoryCache>(), Configuration.GetSection("ApplicationConfiguration").Get<ApplicationConfiguration>()));

            services.AddSingleton<ILdapConfiguration>(Configuration.GetSection("Ldap").Get<LdapConfiguration>());
            services.AddScoped<IldapService, LdapService>();

            //services.AddControllers();
            services.AddAutoMapper(System.AppDomain.CurrentDomain.GetAssemblies());

            services.AddMemoryCache();

            services.AddControllers(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
                config.Filters.Add(new AuthorizeFilter(policy));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    ILogger<Startup> _logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Startup>>();

                    Dictionary<string, IEnumerable<string>> errors = new Dictionary<string, IEnumerable<string>>();
                    var _errDictionary = context.ModelState.Where(k => k.Value.Errors.Count > 0).ToArray();

                    if (context.ModelState.Keys.Any(key => key.Contains("$")))
                    {
                        _logger.LogInformation("One or more validation errors occurred. {@errors}", _errDictionary);

                        return new BadRequestObjectResult(new ApiResponseModel<dynamic>
                        {
                            HttpStatusCode = System.Net.HttpStatusCode.BadRequest,
                            Data = new { ErrorMessage = "Bad Request." },
                            Validation = new ValidationResponse
                            {
                                StatusCode = -400,
                                StatusMessage = "One or more validation errors occurred."
                            }
                        });
                    }

                    foreach (var i in _errDictionary) errors.Add(i.Key, i.Value.Errors.Select(e => e.ErrorMessage));
                    _logger.LogInformation("One or more validation errors occurred. {@errors}", errors);

                    return new BadRequestObjectResult(new ApiResponseModel<Dictionary<string, IEnumerable<string>>>
                    {
                        HttpStatusCode = System.Net.HttpStatusCode.BadRequest,
                        Data = errors,
                        Validation = new ValidationResponse
                        {
                            StatusCode = -400,
                            StatusMessage = "One or more validation errors occurred."
                        }
                    });
                };
            });

            // Add Email Service
            services.AddSingleton<ISamlConfiguration>(Configuration.GetSection("SamlCofiguration").Get<SamlConfiguration>());
            services.AddTransient<IEmailService>(x => new EmailService
                (x.GetRequiredService<IAlertControlRepository>().GetAlertControl(), x.GetRequiredService<ILogger<EmailService>>()));

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ecotime Mobile API", Version = "v1" });
                c.DescribeAllEnumsAsStrings();

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });
            });

            services.Configure<TokenManagement>(Configuration.GetSection("tokenManagement"));
            var token = Configuration.GetSection("tokenManagement").Get<TokenManagement>();

            var secret = Encoding.ASCII.GetBytes(token.Secret);

            services.Configure<AdminAppTokenManagement>(Configuration.GetSection("AdminAppTokenManagement"));
            var adminAppTokenManagement = Configuration.GetSection("AdminAppTokenManagement").Get<AdminAppTokenManagement>();

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;

                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secret),
                    ValidIssuer = token.Issuer,
                    ValidAudience = token.Audience,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero //default is 5 minutes
                };

                x.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                            context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                            context.Response.WriteAsJsonAsync(new ApiResponseModel<string>
                            {
                                HttpStatusCode = HttpStatusCode.Unauthorized,
                                Validation = new ValidationResponse
                                {
                                    StatusCode = -401,
                                    StatusMessage = "Your token has expired, please try to re login get refresh token"
                                }
                            });
                        }

                        return Task.CompletedTask;
                    }
                };

            }).
            AddJwtBearer("AdminScheme", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = adminAppTokenManagement.issuer,
                    ValidAudience = adminAppTokenManagement.audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(adminAppTokenManagement.secret)),
                    ValidateLifetime = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSerilogRequestLogging();

            app.UseMiddleware<ExceptionHandlerMiddleware>();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("./swagger/v1/swagger.json", "Ecotime Mobile API V1"); // Use relative path: "./swagger/v1/swagger.json" if IIS directories are used
                c.RoutePrefix = string.Empty;
            });

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();
            app.UseAuthorization(); // Add this line to enable authorization middleware
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            //app.UseHttpsRedirection();
        }
    }
}
