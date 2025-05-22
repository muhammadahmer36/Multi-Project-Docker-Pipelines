using EcotimeMobileAPI.CommonClasses.Entities;
using System.Collections.Generic;

namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TimesheetCertifyUncertifyResponse
    {
        public IList<TSCertifyUncertifyItem> CertifyList { get; set; }
        public IList<TSCertifyUncertifyItem> UnCertifyList { get; set; }
    }
}