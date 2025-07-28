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

        [HttpGet]
        public async Task<IActionResult> GetCountySummaries()
        {
         
            var groupedListings = await _context.LargeRealEstateListings
                .Where(t => t.State == "Kentucky" && t.City != null && t.Price != null)
                .GroupBy(t => new { t.State, t.City })
                .Select(g => new
                {
                    g.Key.State,
                    g.Key.City,
                    Prices = g.Select(x => x.Price).Where(p => p != null).ToList()
                })
                .ToListAsync();

            Console.WriteLine($"Grouped KY cities: {groupedListings.Count}");

            var cityData = _cityPlaceLoader.GetAll();

            var unmatchedCities = new List<string>();
            var results = new List<BaseCountySummary>();
            foreach (var group in groupedListings)
            {
                if (group.Prices.Count == 0) continue;

                var matchedPlace = CityMatcher.Match(group.City, group.State, cityData);

                if (matchedPlace != null)
                {
                    var sorted = group.Prices.OrderBy(p => p.Value).ToList();
                    var median = sorted.Count % 2 == 0
                        ? (sorted[sorted.Count / 2 - 1].Value + sorted[sorted.Count / 2].Value) / 2
                        : sorted[sorted.Count / 2].Value;

                    results.Add(new BaseCountySummary
                    {
                        State = group.State,
                        County = group.City,
                        AvgPrice = group.Prices.Average(p => p.Value),
                        MedianPrice = median,
                        ListingCount = group.Prices.Count,
                        Latitude = matchedPlace.Latitude,
                        Longitude = matchedPlace.Longitude
                    });
                }

                if (matchedPlace == null)
                {
                    unmatchedCities.Add($"{group.City}, {group.State}");
                }
            }

            _logger.LogInformation("Unmatched cities: {Cities}", string.Join("; ", unmatchedCities));
            _logger.LogInformation("Returning {Count} KY summaries", results.Count);
            return Ok(results);
        }
    }
}