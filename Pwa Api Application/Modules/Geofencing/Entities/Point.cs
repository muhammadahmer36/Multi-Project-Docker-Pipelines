namespace EcotimeMobileAPI.Modules.Geofencing.Entities
{
    public class Point
    {
        public string Name { get => Title; }
        public int Id { get => GeofenceVerticeId; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        internal string Title { get; set; }
        internal int GeofenceVerticeId { get; set; }

    }
}
