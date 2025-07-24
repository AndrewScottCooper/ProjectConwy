import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';


export default function StateBoundary() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/us_states_5m.json")
            .then((response) => response.json())
            .then((data) => setGeoData(data));
    }, []);
    if (!geoData) return null; 

    return <GeoJSON data={geoData} />;
}
