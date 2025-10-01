namespace ProjectConwy.Server.Models
{
    public class RealListing
    {
        public int Id { get; set; }

        // Address
        public string AddressLine1 { get; set; } = null!;
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? CountyName { get; set; }
        public string? CountyFips { get; set; }
        public string StateCode { get; set; } = null!;
        public string? PostalCode { get; set; }

        // Geo
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        // Specs
        public int? PriceUSD { get; set; }
        public decimal? Bedrooms { get; set; }
        public decimal? Bathrooms { get; set; }
        public int? SquareFeet { get; set; }
        public decimal? LotSizeAcres { get; set; }
        public short? YearBuilt { get; set; }

        // Lifecycle
        public string Status { get; set; } = "active";
        public DateTime? DateListed { get; set; }
        public DateTime? DateSold { get; set; }

        // Images
        public string? HeroImageUrl { get; set; }
        public string? ImagesJson { get; set; }

        // Provenance / timestamps
        public string Source { get; set; } = "manual";
        public DateTime CreatedUtc { get; set; }
        public DateTime LastUpdatedUtc { get; set; }
    }
}
