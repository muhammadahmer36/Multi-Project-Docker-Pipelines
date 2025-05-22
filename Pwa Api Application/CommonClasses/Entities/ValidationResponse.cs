namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class ValidationResponse
    {
        public int StatusCode { get; set; }

        public string StatusMessage { get; set; }

        public ValidationResponse Clone()
        {
            return new ValidationResponse { StatusCode = this.StatusCode, StatusMessage = this.StatusMessage };
        }
    }
}