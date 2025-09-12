using Microsoft.AspNetCore.Mvc;
using ProjectConwy.Server.Data;
using ProjectConwy.Server.Models;
using ProjectConwy.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ProjectConwy.Server.Controllers
{
  
    [ApiController]
    [Route("api/[controller]")]
    public class BaseCountySummaryController: ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly CityPlaceLoader _cityPlaceLoader;
        private readonly ILogger<BaseCountySummaryController> _logger;

        public BaseCountySummaryController(
            ApplicationDbContext context,
            CityPlaceLoader cityPlaceLoader,
            ILogger<BaseCountySummaryController> logger)
        {
            _context = context;
            _cityPlaceLoader = cityPlaceLoader;
            _logger = logger;
        }

        [HttpGet("state/{state}")]
        public async Task<IActionResult> GetCountySummaries(string state)
        {

            var grouped = await _context.LargeRealEstateListings
         .Where(t => t.State == state && t.City != null && t.Price != null)
         .Select(t => new { t.State, t.City, t.Price })   // <- keeps result small
         .AsNoTracking()
         .ToListAsync();

            var cityData = _cityPlaceLoader.GetAll();

            var results = new List<BaseCountySummary>();
            var unmatched = new List<string>();

            foreach (var g in grouped.GroupBy(x => new { x.State, x.City }))
            {
                var prices = g.Select(x => x.Price!.Value).OrderBy(v => v).ToList();
                if (prices.Count == 0) continue;

                var median = (prices.Count % 2 == 0)
                    ? (prices[prices.Count / 2 - 1] + prices[prices.Count / 2]) / 2.0
                    : prices[prices.Count / 2];

                var matchedPlace = CityMatcher.Match(g.Key.City!, g.Key.State!, cityData);
                if (matchedPlace != null)
                {
                    results.Add(new BaseCountySummary
                    {
                        State = g.Key.State!,
                        County = g.Key.City!,
                        AvgPrice = prices.Average(),
                        MedianPrice = median,
                        ListingCount = prices.Count,
                        Latitude = matchedPlace.Latitude,
                        Longitude = matchedPlace.Longitude
                    });
                }
                else
                {
                    unmatched.Add($"{g.Key.City}, {g.Key.State}");
                }
            }

            _logger.LogInformation("Unmatched cities: {Cities}", string.Join("; ", unmatched));
            return Ok(results);
        }
    }



}