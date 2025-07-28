namespace ProjectConwy.Server.Models
{
    public class BaseCountySummary
    {
        public string State { get; set; }
        public string County { get; set; }
        public double AvgPrice { get; set; }
        public double MedianPrice { get; set; }
        public int ListingCount { get; set; }

        public string FIPSCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
