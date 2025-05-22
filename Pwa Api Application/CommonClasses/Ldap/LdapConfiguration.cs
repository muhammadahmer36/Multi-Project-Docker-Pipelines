namespace EcotimeMobileAPI.CommonClasses.Ldap
{
    public sealed class LdapConfiguration: ILdapConfiguration
    {
        public string path { get; set; } 
        public string path2 { get; set; }

        public string ldapDomainName { get; set; }

        public string queryParam { get; set; }

        public string attributes { get; set; } 
    }
}
