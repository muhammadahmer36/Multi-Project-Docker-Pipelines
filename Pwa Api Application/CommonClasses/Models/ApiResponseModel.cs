using System.Net;
using EcotimeMobileAPI.CommonClasses.Entities;

namespace EcotimeMobileAPI.CommonClasses.Models
{
    public class ApiResponseModel<TData>
    {
        public ValidationResponse Validation { get; set; }
        public HttpStatusCode HttpStatusCode { get; set; } = HttpStatusCode.OK;
        public string ResponseType { get => eResponseMessageType.ToString(); }
        public bool IsSuccessfull { get; set; }
        public TData Data { get; set; }
        internal eResponseMessageStatusType eResponseMessageType 
        {
            get
            {
                if(IsSuccessfull) return eResponseMessageStatusType.success;

                return HttpStatusCode switch
                {
                    HttpStatusCode.OK => eResponseMessageStatusType.warining,
                    HttpStatusCode.BadRequest => eResponseMessageStatusType.warining,
                    HttpStatusCode.InternalServerError => eResponseMessageStatusType.error,
                    _ => eResponseMessageStatusType.error
                };
            }
            set { } 
        }
    }
}
