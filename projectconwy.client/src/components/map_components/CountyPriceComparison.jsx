import { useEffect, useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import fipsToState from '../../utils/fipsToState';
import { point } from '@turf/helpers';
import { booleanPointInPolygon } from '@turf/turf';


export default function CountyPriceComparison() {
    const [geoData, setGeoData] = useState(null);
    const [countySummaries, setCountySummaries] = useState(null);
    const [countyMatchMap, setCountyMatchMap] = useState({});

    useEffect(() => {
        fetch("/us_counties_5m.json")
            .then((res) => res.json())
            .then((geo) => {
                setGeoData(geo);

                fetch("/api/BaseCountySummary")
                    .then((res) => res.json())
                    .then((summaries) => {
                        setCountySummaries(summaries);

                        const matchMap = buildCountyMatchMap(geo, summaries);
                        setCountyMatchMap(matchMap);
                    });
            });
    }, []);

    function buildCountyMatchMap(geoData, summaries) {
        const resultMap = {}; //THIS IS A STUPID FIX AND I SHOULD FEEL HORRIBLE FOR DOING IT TOMORROW I AM FINDING A BETTER WAY
        const hardcodedCountyOverrides = {
            "lexington": "0500000US21067",
            "lexington-fayette": "0500000US21067", 
            "lexington-fayette urban county": "0500000US21067", "louisville": "0500000US21111",
            "louisville/jefferson county": "0500000US21111",
            "louisville/jefferson county metro government": "0500000US21111"
        };

        for (let summary of summaries) {
            if (!summary.latitude || !summary.longitude) continue;

            const pt = point([summary.longitude, summary.latitude]);
            let matched = false;

            for (let feature of geoData.features) {
                const summaryCounty = summary.county.toLowerCase();
                if (hardcodedCountyOverrides[summaryCounty]) {
                    const forcedGeoId = hardcodedCountyOverrides[summaryCounty];
                    resultMap[forcedGeoId] = summary;
                    console.log("Forced match for:", summary.county, "->", forcedGeoId);
                    continue; 
                }
                const geoId = feature.properties.GEO_ID;
                try {
                    if (booleanPointInPolygon(pt, feature)) {
                        const featureName = feature.properties.NAME.toLowerCase();
                        const summaryCounty = summary.county.toLowerCase();

                        // Prioritize county name match
                        if (featureName === summaryCounty) {
                            summary.geoId = geoId;
                            resultMap[geoId] = summary;
                            matched = true;

                            if (geoId === "0500000US21067") {
                                console.log("Fayette finally matched by name+geometry :", summary);
                            }

                            break;
                        }

                        // Fallback match if no perfect name match found yet
                        if (!matched && !resultMap[geoId]) {
                            summary.geoId = geoId;
                            resultMap[geoId] = summary;
                            matched = true;

                            if (geoId === "0500000US21067") {
                                console.log(" Fayette fallback match:", summary);
                            }
                        }
                    }
                } catch (err) {
                    console.error(" Polygon match error:", err);
                }
            }

                
        }

        return resultMap;
    }

    function onEachFeature(feature, layer) {
        const match = matchCounty(feature);

        if (match) {
            const avg = Math.round(match.avgPrice).toLocaleString();
            const med = Math.round(match.medianPrice).toLocaleString();
            const name = feature.properties.NAME;
            const state = feature.properties.STATE;
            layer.bindPopup(`
                <b>${name}, ${fipsToState[state]}</b><br/>
                Avg Price: $${avg}<br/>
                Median Price: $${med}<br/>
                Listings: ${match.listingCount}
            `);
        } else {
            layer.bindPopup(`<b>${feature.properties.NAME}, ${fipsToState[feature.properties.STATE]}</b><br/>No data available.`);
        }
    }

    function matchCounty(feature) {
        return countyMatchMap[feature.properties.GEO_ID] || null;
    }

    function getColor(avgPrice) {

        if (avgPrice > 800000) return "#800026";
        if (avgPrice > 500000) return "#BD0026";
        if (avgPrice > 300000) return "#E31A1C";
        if (avgPrice > 150000) return "#FC4E2A";
        return "#FFEDA0";
    }

    function style(feature) {
        const match = matchCounty(feature);
        return {
            fillColor: getColor(match?.avgPrice || 0),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    if (
        !geoData ||
        !countySummaries ||
        Object.keys(countyMatchMap).length === 0
    ) return null;


    return <GeoJSON
        data={{
            ...geoData,
            features: geoData.features.filter(
                f => f.properties.STATE === '21'
            )
        }}
        style={style}
        onEachFeature={onEachFeature}
    />;
}