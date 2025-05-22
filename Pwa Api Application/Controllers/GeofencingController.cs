using System;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using EcotimeMobileAPI.Libraries;
using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.Filters.Attributes;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.CommonClasses.Models;
using EcotimeMobileAPI.Libraries.Geofencing;
using EcotimeMobileAPI.CommonClasses.Entities;
using EcotimeMobileAPI.Modules.Geofencing.Entities;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Geofencing.Repositories;
using EcotimeMobileAPI.Modules.AppMessages.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [GeofenceAuthorization]
    public class GeoController : ControllerBase
    {

        private readonly ILogger _logger;
        private readonly IGeofencing _geofencing;
        private readonly IGeofencingRepository _geofencingRepository;
        private readonly IGetAppMessageCache _appMessageCache;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IAuthenticationRepository _authenticationRepository;

        public GeoController(ILogger<TimeOffController> logger, IGeofencingRepository geofencingRepository, IGeofencing geofencing,IAppMessagesRepository appMessagesRepository, IEmailService emailService, IWebHostEnvironment webHostEnvironment, IAuthenticationRepository authenticationRepository)
        {
            _logger = logger;
            _geofencingRepository = geofencingRepository;
            _geofencing = geofencing;
            _appMessageCache = appMessagesRepository as IGetAppMessageCache;
            _emailService = emailService;
            _hostEnvironment = webHostEnvironment;
            _authenticationRepository = authenticationRepository;
        }


        [HttpGet]
        [Route("ResourceInPolygon")]
        public async Task<ActionResult<ApiResponseModel<IEnumerable<ResourceInPolygonResponse>>>> ResourceInPolygon([Required] double latitude, [Required] double longitude)
        {
            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);

            GeofenceCordinatesResponse polygonResponse = await _geofencingRepository.GetAllResourceCordinates(userAccountID);

            if (polygonResponse.Validation.StatusCode != 0)
            {
                return Ok(new ApiResponseModel<GeofenceCordinatesResponse>
                {
                    Validation = polygonResponse.Validation
                });
            }

            List<ResourceInPolygonResponse> resourceGeofenceResponse = new();           

            int[] resources = polygonResponse.GeofenceDetailItems.Select(x => x.ResourceId).Distinct().ToArray();

            foreach (var resource in resources)
            {
                int[] geofenceIds = polygonResponse.GeofenceDetailItems
               .Where(x => x.ResourceId == resource)
               .Select(x => x.GeofenceId)
               .Distinct()
               .ToArray();

                var GeofenceMode = polygonResponse.GeofenceDetailItems
                     .Where(x => x.ResourceId == resource)
                     .Select(x => new GeofenceModeItem
                     {
                         id = x.GeofenceModeId,
                         Title = x.GeofenceModeTitle,
                         Description = x.GeofenceModeDescription,
                         ApplicationMessage = x.GeofenceModeApplicationMessage,
                     }).FirstOrDefault();

                bool IsLocationValid = false;

                for (int j = 0; j < geofenceIds.Length; j++)
                {
                    IEnumerable<GeofenceDetailItem> geofences = polygonResponse.GeofenceDetailItems
                        .Where(x => x.ResourceId == resource && x.GeofenceId == geofenceIds[j])
                        .DistinctBy(x => x.GeofenceVerticeId);
                    
                    IEnumerable<Modules.Geofencing.Entities.Point> points = geofences.Select(x => new Modules.Geofencing.Entities.Point
                    {
                        Latitude = x.Latitude,
                        Longitude = x.Longitude,
                    }).ToList();

                   IsLocationValid = _geofencing.IsPointInPolygon(latitude, longitude, points);

                   if (IsLocationValid) break;
                  
                }

                resourceGeofenceResponse.Add(new ResourceInPolygonResponse() { 
                    IsLocationValid = IsLocationValid,
                    ResourceId = resource,
                    GeofenceMode = GeofenceMode
                });
            }

            return Ok(new ApiResponseModel<IEnumerable<ResourceInPolygonResponse>>
            {
                IsSuccessfull = true,
                Data = resourceGeofenceResponse
            });
        }


        [HttpGet]
        [Route("checkPointInPolygon")]
        public async Task<ActionResult<ApiResponseModel<GeofencingResponse>>> CheckPointInPolygon([Required] double latitude, [Required] double longitude)
        {
            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);

            IEnumerable<Point> polygonCoordinates = await _geofencingRepository.GetPolygonCoordinatesAsync(userAccountID);

            bool hasAnyCordinates = polygonCoordinates.Any();

            bool isInsidePolygon = false;

            if (hasAnyCordinates) isInsidePolygon = _geofencing.IsPointInPolygon(latitude, longitude, polygonCoordinates);

            return Ok(new ApiResponseModel<GeofencingResponse>
            {
                IsSuccessfull = hasAnyCordinates,
                Data = new GeofencingResponse
                {
                    LocationIsValid = isInsidePolygon
                }
            });
        }


        [HttpGet]
        [Route("polygon")]
        public async Task<ActionResult<ApiResponseModel<IEnumerable<Point>>>> polygon()
        {
            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);

            IEnumerable<Point> polygonCoordinates = await _geofencingRepository.GetPolygonCoordinatesAsync(userAccountID);

            return Ok(new ApiResponseModel<IEnumerable<Point>>
            {
                IsSuccessfull = polygonCoordinates.Any(),
                Data = polygonCoordinates
            }); ;
        }


        [HttpPost]
        [Route("GetAllResourcePolygons")]
        public async Task<ActionResult<ApiResponseModel<Dictionary<int, GeofenceCordinatesResponse>>>> GetAllResourcePolygons()
        {
            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);

            GeofenceCordinatesResponse polygonResponse = await _geofencingRepository.GetAllResourceCordinates(userAccountID);

            if (polygonResponse.Validation.StatusCode != 0)
            {
                return Ok(new ApiResponseModel<GeofenceCordinatesResponse>
                {
                    Validation = polygonResponse.Validation
                });
            }

            Dictionary<int, GeofenceCordinatesResponse> resourceGeofenceResponse = new();

            int[] resourceIdIds = polygonResponse.GeofenceDetailItems.Select(x => x.ResourceId).Distinct().ToArray();

            for (int i = 0; i < resourceIdIds.Length; i++)
            {
                int[] geofenceIds = polygonResponse.GeofenceDetailItems
                    .Where(x => x.ResourceId == resourceIdIds[i])
                    .Select(x => x.GeofenceId)
                    .Distinct()
                    .ToArray();

                GeofenceCordinatesResponse resourceGeofence = new GeofenceCordinatesResponse
                {
                    Geofences = new List<GeofenceDetail>(),
                    GeofenceMode = polygonResponse.GeofenceDetailItems
                    .Where(x => x.ResourceId == resourceIdIds[i])
                    .Select(x => new GeofenceModeItem
                    {
                        id = x.GeofenceModeId,
                        Title = x.GeofenceModeTitle,
                        Description = x.GeofenceModeDescription,
                        ApplicationMessage = x.GeofenceModeApplicationMessage,
                    }).FirstOrDefault(),
                };

                for (int j = 0; j < geofenceIds.Length; j++)
                {
                    IEnumerable<GeofenceDetailItem> geofences = polygonResponse.GeofenceDetailItems
                        .Where(x => x.ResourceId == resourceIdIds[i] && x.GeofenceId == geofenceIds[j])
                        .DistinctBy(x => x.GeofenceVerticeId);

                    resourceGeofence.Geofences.Add(new GeofenceDetail
                    {
                        Geofence = geofences.Select(x => new Geofence
                        {
                            Id = x.GeofenceId,
                            Description = x.Description,
                            Title = x.Title
                        })
                        .FirstOrDefault(),

                        GeofenceVertices = geofences.Select(x => new GeofenceVertex
                        {
                            Id = x.GeofenceVerticeId,
                            GeofenceId = x.GeofenceId,
                            Latitude = x.Latitude,
                            Longitude = x.Longitude,
                        }).ToList(),

                    });
                }

                resourceGeofenceResponse.Add(resourceIdIds[i], resourceGeofence);
            }

            return Ok(new ApiResponseModel<Dictionary<int, GeofenceCordinatesResponse>>
            {
                IsSuccessfull = true,
                Validation = new ValidationResponse { StatusMessage = "" },
                Data = resourceGeofenceResponse
            });
        }


        [HttpGet]
        [Route("IsGeofencingApplicable")]
        public async Task<ActionResult<ApiResponseModel<GeofencingApplicableResponse>>> IsGeofencingApplicable()
        {

            int userAccountID = Misc.GetUserAccountID(Request.Headers["Authorization"]);
            _logger.LogInformation($"Get PunchTime History for userAccountID = '{userAccountID}'");

            return Ok(new ApiResponseModel<GeofencingApplicableResponse>
            {
                IsSuccessfull = true,
                Data = new GeofencingApplicableResponse { IsGeofencingApplicable = await _geofencingRepository.IsGeofencingApplicableAsync(userAccountID) }
            });
        }


        [HttpPost]
        [Route("Geofence")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<GeofenceSuccessResponse>>> Geofence([FromBody] Geofence geofence)
        {
            try
            {
                int id = await _geofencingRepository.SaveGeofence(geofence);
                return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                {
                    IsSuccessfull = true,
                    Data = new GeofenceSuccessResponse { Id = id },
                    HttpStatusCode = HttpStatusCode.Created,
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceCreatedSuccess),

                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofence() Encountered Fatal Database Error => {ex.Message}");

                return new ApiResponseModel<GeofenceSuccessResponse>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceSaveFailed),
                };
            }
        }


        [HttpPost]
        [Route("UpdateGeofence")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<GeofenceSuccessResponse>>> UpdateGeofence([FromBody] Geofence geofence)
        {
            try
            {
                int id = await _geofencingRepository.UpdateGeofence(geofence);
                return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                {
                    IsSuccessfull = true,
                    Data = new GeofenceSuccessResponse { Id = id },
                    HttpStatusCode = HttpStatusCode.OK,
                    Validation = id > 0 ? _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceUpdateSuccess) : null,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"UpdateGeofence() Encountered Fatal Database Error => {ex.Message}");

                ValidationResponse validationresponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceUpdateFailed);

                return new ApiResponseModel<GeofenceSuccessResponse>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationresponse,
                };
            }
        }


        [HttpPost]
        [Route("GeofenceVertex")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<GeofenceSuccessResponse>>> GeofenceVertex([FromBody] GeofenceVertexRequest geofenceVertex)
        {
            try
            {         
                    var validationMessage = string.Join("; ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                    if (validationMessage.Any())
                    {
                        return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                        {
                            IsSuccessfull = false,
                            Data = null,
                            HttpStatusCode = HttpStatusCode.BadRequest,
                            eResponseMessageType = eResponseMessageStatusType.error,
                            Validation = new ValidationResponse ()
                            {
                                StatusMessage = validationMessage
                            }
                        });
                    }

                    int result = await _geofencingRepository.SaveGeofenceVertex(geofenceVertex);

                    if ((eErrorMessageCode)result == eErrorMessageCode.InvalidPolygon)
                    {

                        return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                        {
                            IsSuccessfull = false,
                            Data = null,
                            HttpStatusCode = HttpStatusCode.BadRequest,
                            Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidPolygon),
                            eResponseMessageType = eResponseMessageStatusType.error
                        });
                    }

                    if ((eErrorMessageCode)result == eErrorMessageCode.InvalidGeofenceID)
                    {
                        return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                        {
                            IsSuccessfull = false,
                            Data = null,
                            HttpStatusCode = HttpStatusCode.BadRequest,
                            Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidGeofenceID),
                            eResponseMessageType = eResponseMessageStatusType.error
                        });
                    }

                    return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                    {
                        IsSuccessfull = true,
                        HttpStatusCode = HttpStatusCode.Created,
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofencePolygonSuccess),
                        eResponseMessageType = eResponseMessageStatusType.success
                    });
             }
            
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofenceVertex() Encountered Fatal Database Error => {ex.Message}");
                ValidationResponse validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceSaveFailed);

                return new ApiResponseModel<GeofenceSuccessResponse>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationResponse,
                };
            }
        }


        [HttpGet]
        [Route("Geofence")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<IEnumerable<Geofence>>>> Geofence()
        {
            try
            {
                IEnumerable<Geofence> geofences = await _geofencingRepository.GetGeofences();
                return Ok(new ApiResponseModel<IEnumerable<Geofence>>
                {
                    IsSuccessfull = geofences.Any(),
                    Data = geofences,
                    eResponseMessageType = eResponseMessageStatusType.success
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofence() Encountered Fatal Database Error => {ex.Message}");

                ValidationResponse validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceDeleteFailed);

                return Ok(new ApiResponseModel<IEnumerable<Geofence>>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationResponse,
                });
            }

        }


        [HttpGet]
        [Route("GeofenceVertex")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<IEnumerable<GeofenceVertex>>>> GetGeofenceVertex([Required] int GeofenceId)
        {
            try
            {
                var geofenceVertexResult = await _geofencingRepository.GetGeofencesVertexByGeofenceId(GeofenceId);

                if ((eErrorMessageCode)geofenceVertexResult.Result == eErrorMessageCode.InvalidGeofenceID)
                {
                    return Ok(new ApiResponseModel<IEnumerable<GeofenceVertex>>
                    {
                        IsSuccessfull = false,
                        Data = null,
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidGeofenceID),
                        eResponseMessageType = eResponseMessageStatusType.error
                    });
                }

                return Ok(new ApiResponseModel<IEnumerable<GeofenceVertex>>
                {
                    IsSuccessfull = true,
                    Data = geofenceVertexResult.GeofenceVertices,
                    HttpStatusCode = HttpStatusCode.OK,
                    eResponseMessageType = eResponseMessageStatusType.success
                });

            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofence() Encountered Fatal Database Error => {ex.Message}");

                ValidationResponse validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceDeleteFailed);

                return Ok(new ApiResponseModel<IEnumerable<GeofenceVertex>>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationResponse,
                });
            }

        }


        [HttpDelete]
        [Route("Geofence")]
        [Authorize(AuthenticationSchemes = "AdminScheme")]
        public async Task<ActionResult<ApiResponseModel<GeofenceSuccessResponse>>> DeleteGeofence([Required] int GeofenceId)
        {
            try
            {
                int result = await _geofencingRepository.DeleteGeofenceVertex(GeofenceId);

                if ((eErrorMessageCode)result == eErrorMessageCode.GeofenceDeleteConflict)
                {
                    return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                    {
                        IsSuccessfull = false,
                        Data = new GeofenceSuccessResponse { Id = GeofenceId },
                        HttpStatusCode = HttpStatusCode.Conflict,
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceDeleteConflict),
                        eResponseMessageType = eResponseMessageStatusType.error
                    });
                }

                if ((eErrorMessageCode)result == eErrorMessageCode.InvalidGeofenceID)
                {
                    return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                    {
                        IsSuccessfull = false,
                        Data = null,
                        HttpStatusCode = HttpStatusCode.BadRequest,
                        Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.InvalidGeofenceID),
                        eResponseMessageType = eResponseMessageStatusType.error
                    });
                }


                return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                {
                    IsSuccessfull = true,
                    Data = new GeofenceSuccessResponse { Id = GeofenceId },
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofencePolygonDeletedSuccess),
                    eResponseMessageType = eResponseMessageStatusType.success
                });

            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofence() Encountered Fatal Database Error => {ex.Message}");

                ValidationResponse validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceDeleteFailed);

                return new ApiResponseModel<GeofenceSuccessResponse>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationResponse,
                };
            }
        }

        [HttpGet]
        [Route("NotifyGeofenceRestrictions")]
        public async Task<ActionResult<ApiResponseModel<GeofenceSuccessResponse>>> NotifyGeofenceRestriction([Required] string EmployeeNumber, [Required] double Latitude, [Required] double Longitude, [Required] int  ResourceId, [Required] int functionId, [Required] string punchDeviceName, [Required] string punchDateTime, [Required]  int timeZoneOffset)
        {
            try
            {
                             
                string Resource = Enum.GetName(typeof(Resource), ResourceId);
                string RestrictionMode = Enum.GetName(typeof(GeofenceRestriction), 2);
                string timePunchType = ((ePunchType)functionId).ToString();

                punchDateTime = Convert.ToDateTime(punchDateTime.Replace('Z',' ')).AddHours(timeZoneOffset).ToString();

                await _geofencingRepository.SetGeoFenceWarningAlert(timePunchType, punchDeviceName, punchDateTime, EmployeeNumber);

                return Ok(new ApiResponseModel<GeofenceSuccessResponse>
                {
                    IsSuccessfull = true,
                    Data = null,
                    Validation = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceRestrictionAlertSuccess),
                    eResponseMessageType = eResponseMessageStatusType.success
                });

            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveGeofence() Encountered Fatal Database Error => {ex.Message}");

                ValidationResponse validationResponse = _appMessageCache.GetAppMessageById(eErrorMessageCode.GeofenceDeleteFailed);

                return new ApiResponseModel<GeofenceSuccessResponse>
                {
                    HttpStatusCode = HttpStatusCode.InternalServerError,
                    Validation = validationResponse,
                };
            }
        }

    }
}
