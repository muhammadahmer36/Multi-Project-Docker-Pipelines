using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Filters.Attributes
{
    public class MustNotHaveSpacesAttribute: ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            string valueAstring = value as string;

            bool isValueStringNullOrEmpty = string.IsNullOrEmpty(valueAstring);

            if (isValueStringNullOrEmpty) return true;
            
            return !valueAstring.Contains(' ');
        }
    }
}
