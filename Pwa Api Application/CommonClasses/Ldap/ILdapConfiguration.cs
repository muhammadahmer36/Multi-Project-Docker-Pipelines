namespace EcotimeMobileAPI.CommonClasses.Ldap
{
    public interface ILdapConfiguration
    {
        string path { get; }
        string path2 { get; }

        string queryParam { get; }
        string attributes { get; }
        string ldapDomainName { get; }
    }
}