using System;

namespace EcotimeMobileAPI.CommonClasses.Entities
{
    public abstract class BaseEntity
    {
        public string actionuser { get; set; }
        public DateTime actiondate { get; set; }
    }
}