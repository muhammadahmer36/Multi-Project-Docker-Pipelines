using System;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public class ClockWidgetItem
    {
        public int ProfileId { get; set; }

        public int FunctionId { get; set; }

        public int DataElementId { get; set; }

        public bool GetAdditionalData { get; set; }

        public string FunctionName { get; set; }

        public string EntryCode { get; set; }

        public string ImageName { get; set; }

        public string Description { get; set; }

        public bool FunctionNextExpected { get; set; }

        public string FunctionButton_Color { get; set; }

        public string FunctionButton_Align { get; set; }

        public int DisplayOrder { get; set; }

        public string ControllerName { get; set; }

        public DateTime DbServerGMT { get; set; }
    }
}