import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';


export default function CountyPriceComparison() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/us_counties_5m.json")
            .then((response) => response.json())
            .then((data) => setGeoData(data));
    }, []);
    if (!geoData) return null;

    return <GeoJSON data={geoData} />;
}
