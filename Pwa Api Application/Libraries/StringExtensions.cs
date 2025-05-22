namespace EcotimeMobileAPI.Libraries
{
    public static class StringExtensions
    {
        public static string FormatHtml(this string format, params object[] args)
        {
            format = format.Replace("{{", "{").Replace("}}", "}");

            return string.Format(format, args);
        }
    }
}
