using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.DependencyInjection;
using EcotimeMobileAPI.Modules.Authentication.Entities;
using EcotimeMobileAPI.Modules.Authentication.Repositories;

namespace EcotimeMobileAPI.Filters.Attributes
{
    /// <summary>
    /// This attribute class will validate Password configuration according to "PasswordValidation" class
    /// </summary>
    
    //AllowMultiple = true will allow more then one [PasswordValidatorAttribute] [PasswordValidatorAttribute] on controller/method
    //Inherited = true will allow inheritance for other classes and it will allow to called from parent clasess
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    public class PasswordValidatorAttribute: DataTypeAttribute
    {
        private string _fieldName { get; set; }
        public PasswordValidatorAttribute(): base(DataType.Password) {}

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            PasswordValidation passwordValidation = validationContext.GetRequiredService<PasswordConfigurationCache>()?.GetPasswordValidation();

            _fieldName = validationContext.MemberName;

            if (passwordValidation == null) throw new NullReferenceException("PasswordValidation cannot be null."); 

            if (IsPasswordValid(passwordValidation, value as string)) return ValidationResult.Success;
            
            return new ValidationResult(ErrorMessage);
        }

        private bool IsPasswordValid(PasswordValidation passwordValidation, string password)
        {
            if (password is null)
            {
                ErrorMessage = $"{_fieldName} is required.";
                return false;
            }

            if (password.Length < passwordValidation.MinPwdLength)
            {
                ErrorMessage = $"{_fieldName} should be at least {passwordValidation.MinPwdLength} characters long.";
                return false; 
            }

            if (password.Length > passwordValidation.MaxPwdLength)
            {
                ErrorMessage = $"{_fieldName} should not be at greater than {passwordValidation.MaxPwdLength} characters.";
                return false;
            }

            if (passwordValidation.MinNoOfDigits > 0 && password.Count(char.IsDigit) < passwordValidation.MinNoOfDigits)
            {
                ErrorMessage = $"{_fieldName} must contains minimum {passwordValidation.MinNoOfDigits} number of digits.";
                return false;
            }

            if (passwordValidation.MinNoOfSpecialCharacter > 0 && password.Count(IsSpecialCharacter) < passwordValidation.MinNoOfSpecialCharacter)
            {
                ErrorMessage = $"{_fieldName} must contains minimum {passwordValidation.MinNoOfSpecialCharacter} number of special.";
                return false;
            }

            if (!string.IsNullOrEmpty(passwordValidation.NotAllowedCharacters) && passwordValidation.NotAllowedCharacters.Any(c => password.Contains(c)))
            {
                ErrorMessage = $"{_fieldName} should not contains any of these '{passwordValidation.NotAllowedCharacters}' characters.";
                return false;
            }

            return true;
        }

        private static bool IsSpecialCharacter(char c)
        {
            return !char.IsLetterOrDigit(c);
        }
    }
}
