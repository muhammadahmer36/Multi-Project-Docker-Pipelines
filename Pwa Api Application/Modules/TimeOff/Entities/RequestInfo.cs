namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestInfo
    {
        public string TableTitle { get; set; }

        public int RequestedMonth { get; set; }

        public int RequestedYear { get; set; }

        public string RequestedReviewStatusCodes { get; set; }
    }
}