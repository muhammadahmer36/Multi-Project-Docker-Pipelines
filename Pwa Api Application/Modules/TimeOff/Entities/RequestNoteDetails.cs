namespace EcotimeMobileAPI.Modules.TimeOff.Entities
{
    public class RequestNoteDetails
    {
        public int RequestId { get; set; }

        public string EnteredByName { get; set; }

        public string EnteredOn { get; set; }

        public string Note { get; set; }

        public bool ManagerNote { get; set; }
    }
}