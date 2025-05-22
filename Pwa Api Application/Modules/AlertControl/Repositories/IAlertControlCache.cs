using EcotimeMobileAPI.CommonClasses;
using EcotimeMobileAPI.CommonClasses.Email;
using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.AlertControl.Repositories
{
    public interface IAlertControlCache
    {
        public IEmailConfiguration GetAlertControl();
    }
}
