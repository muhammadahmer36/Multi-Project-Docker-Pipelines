namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestNoteSummary
    {
        public int RequestId { get; set; }

        public string TableTitle { get; set; }

        public int ReviewStatus_Code { get; set; }

        public string ReviewStatus_Title { get; set; }

        public string ReviewStatus_Color { get; set; }

        public int ProcessStatus_Code { get; set; }

        public string ProcessStatus_Title { get; set; }

        public string ProcessStatus_Color { get; set; }
    }
}