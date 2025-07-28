using CsvHelper;
using CsvHelper.Configuration;
using ProjectConwy.Server.Models;
using System.Globalization;
using System.IO;
using System.Linq;


namespace ProjectConwy.Server.Services
{
    public class CityPlaceLoader
    {

        private readonly List<CityPlaceEntry> _entries;

        public CityPlaceLoader(string csvPath)
        {
            using var reader = new StreamReader(csvPath);

            var config = new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
            {
                MissingFieldFound = null,
                PrepareHeaderForMatch = args => args.Header.Trim(),
                TrimOptions = CsvHelper.Configuration.TrimOptions.Trim,
                HeaderValidated = null,
            };


            using var csv = new CsvReader(reader, config);

            csv.Read();
            csv.ReadHeader();
            // Register the column mapping
            csv.Context.RegisterClassMap<CityPlaceEntryMap>();


            _entries = csv.GetRecords<CityPlaceEntry>()
    .Select(e => new CityPlaceEntry
    {
        City = NormalizeCity(e.City),
        State = e.State.Trim().ToUpper(),
        Latitude = e.Latitude,
        Longitude = e.Longitude
    })
    .ToList();

            string NormalizeCity(string city)
            {
                return city?.Trim().ToLower().Replace(" city", "").Replace(" cdp", "");
            }

        }
        public List<CityPlaceEntry> GetAll() => _entries;

    }
}
