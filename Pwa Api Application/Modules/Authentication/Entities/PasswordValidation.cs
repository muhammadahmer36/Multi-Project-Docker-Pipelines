namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class PasswordValidation
    {
        public int MinPwdLength { get; set; }
        public int MaxPwdLength { get; set; }
        public int MinNoOfDigits { get; set; }
        public int MinNoOfSpecialCharacter { get; set; }
        public string NotAllowedCharacters { get; set; }
    }
}