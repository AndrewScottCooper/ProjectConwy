using FuzzySharp;
using ProjectConwy.Server.Models;
using System.Text.RegularExpressions;

public static class CityMatcher
{
    private static readonly Dictionary<string, string> StateToAbbrev = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Alabama"] = "AL", ["Alaska"] = "AK", ["Arizona"] = "AZ",
        ["Arkansas"] = "AR",["California"] = "CA", ["Colorado"] = "CO",
        ["Connecticut"] = "CT", ["Delaware"] = "DE",
        ["Florida"] = "FL",["Georgia"] = "GA", ["Hawaii"] = "HI", ["Idaho"] = "ID",
        ["Illinois"] = "IL", ["Indiana"] = "IN", ["Iowa"] = "IA",
        ["Kansas"] = "KS", ["Kentucky"] = "KY", ["Louisiana"] = "LA",
        ["Maine"] = "ME",["Maryland"] = "MD",["Massachusetts"] = "MA",
        ["Michigan"] = "MI",["Minnesota"] = "MN",
        ["Mississippi"] = "MS",["Missouri"] = "MO",["Montana"] = "MT",
        ["Nebraska"] = "NE",["Nevada"] = "NV", ["New Hampshire"] = "NH", ["New Jersey"] = "NJ", ["New Mexico"] = "NM",
        ["New York"] = "NY",["North Carolina"] = "NC",  ["North Dakota"] = "ND", ["Ohio"] = "OH", ["Oklahoma"] = "OK",
        ["Oregon"] = "OR",  ["Pennsylvania"] = "PA", ["Rhode Island"] = "RI", ["South Carolina"] = "SC",["South Dakota"] = "SD", 
        ["Tennessee"] = "TN", ["Texas"] = "TX",  ["Utah"] = "UT",["Vermont"] = "VT", ["Virginia"] = "VA",["Washington"] = "WA",
        ["West Virginia"] = "WV",["Wisconsin"] = "WI", ["Wyoming"] = "WY",["District of Columbia"] = "DC",["Puerto Rico"] = "PR"
    };

    public static CityPlaceEntry? Match(string cityName, string fullStateName, List<CityPlaceEntry> csvData)
    {
        if (!StateToAbbrev.TryGetValue(fullStateName.Trim(), out var stateAbbr))
            return null;

        string normalizedCity = Clean(cityName);

        var candidates = csvData.Where(c => string.Equals(c.State.Trim(), stateAbbr, StringComparison.OrdinalIgnoreCase)).ToList();

        var bestMatch = candidates
            .Select(c => new
            {
                Entry = c,
                Score = Fuzz.TokenSortRatio(normalizedCity, Clean(c.City))
            })
            .OrderByDescending(x => x.Score)
            .FirstOrDefault();

        if (bestMatch != null && bestMatch.Score > 60)
        {
            return bestMatch.Entry;
        }



        return null;
    }

    private static string Clean(string name)
    {
        return Regex.Replace(name.ToLowerInvariant(), @"\b(city|urban|municipality|town)\b", "")
            .Replace("-", " ")
            .Replace(".", "")
            .Trim();
    }
}