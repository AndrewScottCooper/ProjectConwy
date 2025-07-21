using Microsoft.AspNetCore.Mvc;
using ProjectConwy.Server.Data;
using ProjectConwy.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ProjectConwy.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LargeRealEstateListingsController: ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LargeRealEstateListingsController(ApplicationDbContext context)
        { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LargeRealEstateListings>>> GetListings()
        {
            return await _context.LargeRealEstateListings.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<LargeRealEstateListings>> GetListings(int id)
        {
            var listing = await _context.LargeRealEstateListings.FindAsync(id);

            if(listing == null)
            {
                return NotFound();
            }
            return listing;
        }
    }
}
