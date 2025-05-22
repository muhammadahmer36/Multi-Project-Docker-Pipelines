using System.ComponentModel.DataAnnotations;

namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class Geofence
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string ActionUser { get; set; }
    }

}
