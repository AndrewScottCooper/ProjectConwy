namespace ProjectConwy.Server.Models
{
    public class LargeRealEstateListings
    {

        public int Id { get; set; }
        public string? BrokeredBy { get; set; }
        public string? Status { get; set; }
        public long? Price { get; set; }
        public int? Bed { get; set; }
        public int? Bath { get; set; }
        public double? AcreLot { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public int? HouseSize { get; set; }
        public string? PrevSoldDate { get; set; }
        public bool? IsComplete { get; set; }
        public string? MissingReason { get; set; }
    }
}
