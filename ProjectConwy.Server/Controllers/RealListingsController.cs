namespace ProjectConwy.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using ProjectConwy.Server.Data;
    using ProjectConwy.Server.Models;
    using ProjectConwy.Server.Data.DTOs;

    [ApiController]
    [Route("api/real-listings")]
    public class RealListingsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public RealListingsController(ApplicationDbContext db) => _db = db;

        // GET /api/real-listings?west=&south=&east=&north=&minPrice=&maxPrice=&status=&take=300
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListingMarkerDto>>> Get(
            [FromQuery] decimal west,
            [FromQuery] decimal south,
            [FromQuery] decimal east,
            [FromQuery] decimal north,
            [FromQuery] int? minPrice,
            [FromQuery] int? maxPrice,
            [FromQuery] string? status,
            [FromQuery] int take = 300)
        {
            take = Math.Clamp(take, 1, 500);

            var q = _db.Set<RealListing>().AsNoTracking().Where(r =>
                r.Latitude >= south && r.Latitude <= north &&
                r.Longitude >= west && r.Longitude <= east);

            if (minPrice.HasValue) q = q.Where(r => r.PriceUSD >= minPrice.Value);
            if (maxPrice.HasValue) q = q.Where(r => r.PriceUSD <= maxPrice.Value);
            if (!string.IsNullOrWhiteSpace(status)) q = q.Where(r => r.Status == status);

            var data = await q.OrderByDescending(r => r.PriceUSD)
                              .Take(take)
                              .Select(r => new ListingMarkerDto(
                                  r.Id, r.AddressLine1, r.City, r.StateCode,
                                  r.PriceUSD, r.Bedrooms, r.Bathrooms, r.SquareFeet,
                                  r.Latitude, r.Longitude, r.Status, r.HeroImageUrl))
                              .ToListAsync();

            return Ok(data);
        }

        // GET /api/real-listings/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ListingDetailDto>> GetOne(int id)
        {
            var r = await _db.Set<RealListing>().AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r is null) return NotFound();

            var images = new List<string>();
            if (!string.IsNullOrWhiteSpace(r.ImagesJson))
            {
                try { images = System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.ImagesJson!) ?? new(); }
                catch { /* ignore */ }
            }
            if (images.Count == 0 && !string.IsNullOrWhiteSpace(r.HeroImageUrl))
                images.Add(r.HeroImageUrl!);

            return new ListingDetailDto(
                r.Id, r.AddressLine1, r.AddressLine2, r.City, r.CountyName,
                r.StateCode, r.PostalCode,
                r.PriceUSD, r.Bedrooms, r.Bathrooms, r.SquareFeet,
                r.LotSizeAcres, r.YearBuilt, r.Status, r.DateListed,
                r.Latitude, r.Longitude,
                r.HeroImageUrl, images
            );
        }




        // GET /api/real-listings/random?state=KY&status=Active
        [HttpGet("random")]
        public async Task<ActionResult<ListingDetailDto>> GetRandom(
            [FromQuery] string? state = null,
            [FromQuery] string? status = "Active")
        {
            IQueryable<RealListing> q = _db.Set<RealListing>().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(state))
                q = q.Where(r => r.StateCode == state);

            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(r => r.Status == status);

            var count = await q.CountAsync();
            if (count == 0) return NotFound();

            var skip = Random.Shared.Next(count);
            var r = await q.OrderBy(r => r.Id).Skip(skip).FirstOrDefaultAsync();
            if (r is null) return NotFound();

            return MapToDto(r);
        }

        private static ListingDetailDto MapToDto(RealListing r)
        {
            var images = new List<string>();
            if (!string.IsNullOrWhiteSpace(r.ImagesJson))
            {
                try { images = System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.ImagesJson!) ?? new(); }
                catch { /* ignore */ }
            }
            if (images.Count == 0 && !string.IsNullOrWhiteSpace(r.HeroImageUrl))
                images.Add(r.HeroImageUrl!);

            return new ListingDetailDto(
                r.Id, r.AddressLine1, r.AddressLine2, r.City, r.CountyName,
                r.StateCode, r.PostalCode,
                r.PriceUSD, r.Bedrooms, r.Bathrooms, r.SquareFeet,
                r.LotSizeAcres, r.YearBuilt, r.Status, r.DateListed,
                r.Latitude, r.Longitude,
                r.HeroImageUrl, images
            );
        }

    }
}
