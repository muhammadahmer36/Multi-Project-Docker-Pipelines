namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class ApplicationInfo: TimeFormatItem
    {
        public string UserEmpNo { get; set; }

        public string UserEmployeeName { get; set; }

        public string AppHeader { get; set; }

        public string AppFooter { get; set; }

        public int MessageCount { get; set; }

        public int NumCharsForAutoComplete { get; set; }
    }
}