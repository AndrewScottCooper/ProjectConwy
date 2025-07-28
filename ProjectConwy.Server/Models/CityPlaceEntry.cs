using CsvHelper.Configuration;


namespace ProjectConwy.Server.Models
{
    public class CityPlaceEntry
    {
        public string City { get; set; }
        public string State { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
