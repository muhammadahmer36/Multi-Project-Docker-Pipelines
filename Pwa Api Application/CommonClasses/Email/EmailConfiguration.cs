namespace EcotimeMobileAPI.CommonClasses.Email
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SmtpFromName { get; set; }
        public string SmtpFromAddress { get; set; }
        public int SmtpSecureSocketOption { get; set; }
        public string SmtpDomain { get; set; }

        public string PopServer { get; set; }
        public string SenderEmail { get; set; }
        public int MaxFailCount { get; set; }
        public string EmailFooter { get; set; }
        public int AuditLifetime { get; set; }
        public int SmtpTimeout { get; set; }
        public int PoolInterval { get; set; }
        public int NoOfTries { get; set; }
        public int TestMode { get; set; }
        public string TestRecipientEmailAddress { get; set; }
        public bool AuditMode { get; set; }
        public int PopPort { get; set; }
        public string PopUsername { get; set; }
        public string PopPassword { get; set; }
        public string SupportEmailAddress { get; set; }
        public bool IsAuthenticationRequired { get; set; }
    }
}