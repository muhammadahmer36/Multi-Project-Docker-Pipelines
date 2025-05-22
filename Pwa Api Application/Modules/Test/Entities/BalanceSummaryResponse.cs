using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Test.Entities
{
    public class UserLogins
    {
        public string LoginName { get; set; }
        public int UserAccountId { get; set; }
        public string PasswordHsh{ get; set; }
    }
}