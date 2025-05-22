namespace EcotimeMobileAPI.Modules.TimePunches.Entities
{
    public class PunchDetails
    {
        public int DataElementId { get; set; }

        public int FldId { get; set; }

        public int TaskLevel { get; set; }

        public string FieldCaption { get; set; }

        public string FieldInputTypeCode { get; set; }

        public string FieldInputTypeName { get; set; }

        public int DisplayOrder { get; set; }

        public bool FieldRequired { get; set; }

        public string DataTypeCode { get; set; }

        public string DataTypeName { get; set; }

        public int NumCharsForAutoComplete { get; set; }

        public bool UseSelectList { get; set; }
        internal string FieldRequiredMsg { get; set; }
        internal string FunctionName { get; set; }
        internal int FunctionId { get; set; }
    }
}