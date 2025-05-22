using System.Collections.Generic;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class TSSearchResultResponse
    {
        public ICollection<DropDownIntItem> SearchResults { get; set; }
    }
}