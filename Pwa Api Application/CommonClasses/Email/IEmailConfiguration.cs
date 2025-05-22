namespace EcotimeMobileAPI.CommonClasses.Email
{
    public interface IEmailConfiguration
    {
        string SmtpServer { get; }
        int SmtpPort { get; }
        string SmtpUsername { get; }
        string SmtpPassword { get; }
        string SmtpFromName { get; }
        string SmtpFromAddress { get; }
        int SmtpSecureSocketOption { get; }
        string SmtpDomain { get; }

        public string SenderEmail { get; }
        public int MaxFailCount { get; }
        public string EmailFooter { get; }
        public int AuditLifetime { get; }
        public int SmtpTimeout { get; }
        public int PoolInterval { get; }
        public int NoOfTries { get; }
        public int TestMode { get; }
        public string TestRecipientEmailAddress { get; }
        public bool AuditMode { get; }

        string PopServer { get; }
        int PopPort { get; }
        string PopUsername { get; }
        string PopPassword { get; }
        public string SupportEmailAddress { get; }
        public bool IsAuthenticationRequired { get; }
    }
}