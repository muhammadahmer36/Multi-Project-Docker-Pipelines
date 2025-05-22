using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Filters.Attributes
{
    public class NotEmptyAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value is string stringValue)
            {
                return stringValue != null && !string.IsNullOrWhiteSpace(stringValue);
            }

            return true;
        }
    }
}
