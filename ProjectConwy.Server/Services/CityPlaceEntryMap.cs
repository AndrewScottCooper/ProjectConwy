using CsvHelper.Configuration;
using ProjectConwy.Server.Models;

namespace ProjectConwy.Server.Services
{
    public class CityPlaceEntryMap : ClassMap<CityPlaceEntry>
    {

        public CityPlaceEntryMap()
        {
            Map(m => m.City).Name("NAME");
            Map(m => m.State).Name("USPS");
            Map(m => m.Latitude).Name("INTPTLAT");
            Map(m => m.Longitude).Name("INTPTLONG");
        }
    }
}
