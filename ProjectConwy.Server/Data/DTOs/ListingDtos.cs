namespace ProjectConwy.Server.Data.DTOs
{
    public record ListingMarkerDto(
        int Id,
        string AddressLine1,
        string? City,
        string StateCode,
        int? PriceUSD,
        decimal? Bedrooms,
        decimal? Bathrooms,
        int? SquareFeet,
        decimal Latitude,
        decimal Longitude,
        string Status,
        string? HeroImageUrl
    );

    public record ListingDetailDto(
        int Id,
        string AddressLine1,
        string? AddressLine2,
        string? City,
        string? CountyName,
        string StateCode,
        string? PostalCode,
        int? PriceUSD,
        decimal? Bedrooms,
        decimal? Bathrooms,
        int? SquareFeet,
        decimal? LotSizeAcres,
        short? YearBuilt,
        string Status,
        DateTime? DateListed,
        decimal Latitude,
        decimal Longitude,
        string? HeroImageUrl,
        List<string> Images
    );
}
