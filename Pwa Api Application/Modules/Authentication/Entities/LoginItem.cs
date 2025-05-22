using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class LoginItem
    {
        [Key]
        public string UserName { get; set; }

        public string EmpNo { get; set; }

        public string Password { get; set; }

        public string Salt { get; set; }

        public int Active { get; set; }
    }
}