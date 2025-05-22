namespace EcotimeMobileAPI.Modules.Timesheet.Entities
{
    public class TSConfigControlItem
    {
        public int FldId { get; set; }

        public string FldDbName { get; set; }

        public string FieldCaption { get; set; }

        public string FieldInputTypeCode { get; set; }

        public string FieldInputTypeName { get; set; }

        public int DisplayOrder { get; set; }

        public bool UseSelectList { get; set; }

        public int DisplaySection { get; set; }

        public bool FieldRequired { get; set; }
    }
}