using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Filters.Attributes
{
    public class MinLenghtAttribute: MinLengthAttribute
    {
        public MinLenghtAttribute(int minLenth): base(minLenth) { }

        public override bool IsValid(object value)
        {
            string valueString = value as string;

            return !string.IsNullOrEmpty(valueString) && base.IsValid(valueString.Trim());
        }
    }
}
