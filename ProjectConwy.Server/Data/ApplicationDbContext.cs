using Microsoft.EntityFrameworkCore;
using ProjectConwy.Server.Models;
using System.Reflection;

namespace ProjectConwy.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { 
        }
        public DbSet<LargeRealEstateListings> LargeRealEstateListings { get; set; }

    }
}
