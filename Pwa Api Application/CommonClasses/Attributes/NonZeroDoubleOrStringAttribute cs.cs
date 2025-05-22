using System;
using System.ComponentModel.DataAnnotations;

public class NonZeroDoubleOrStringAttribute : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value == null)
        {
            return false;
        }

   
        // If the value is not a string, attempt to parse it to double
        if (double.TryParse(value.ToString(), out double doubleValue))
        {
            return doubleValue != 0;
        }

        return false;
    }
}