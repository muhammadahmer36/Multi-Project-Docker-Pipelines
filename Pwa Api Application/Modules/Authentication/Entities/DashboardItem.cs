namespace EcotimeMobileAPI.Modules.Authentication.Entities
{
    public class DashboardItem
    {
        public int ResourceId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string CommandName { get; set; }

        public string ControllerName { get; set; }
    }
}