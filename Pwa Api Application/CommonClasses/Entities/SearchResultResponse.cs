using System.Collections.Generic;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class SearchResultResponse
    {
        public ICollection<DropDownStringItem> SearchResults { get; set; }
    }
}