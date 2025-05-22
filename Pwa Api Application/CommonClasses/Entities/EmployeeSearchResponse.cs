using System.Collections.Generic;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class EmployeeSearchResponse
    {
        public ICollection<EmployeeSearchItem> EmployeeSearchItems { get; set; }
    }
}