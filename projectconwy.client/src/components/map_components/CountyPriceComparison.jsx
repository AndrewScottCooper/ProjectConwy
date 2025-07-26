import { useEffect, useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';


export default function CountyPriceComparison() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/us_counties_5m.json")
            .then((response) => response.json())
            .then((data) => setGeoData(data));
    }, []);


    //TODO GET NUMBERS FROM THE PYTHON MODEL AND COLOR THE COUNTIES BASED ON HOW THEY COMPARE
    function onEachFeature(feature, layer) {


        const name = feature.properties.NAME;
        const state = feature.properties.STATE; //THIS IS JUST A NUMBER IN THE JSON AND I NEED TO SPEND SOME BRAIN POWER TO CORRECT AHHHHHHHHHHHHHHHHHHHHHHHH (BUT its so cool that it works)
        layer.bindPopup(`<b>${name}, ${state}<b>`);
    }

    if (!geoData) return null;

    return <GeoJSON data={geoData} onEachFeature={onEachFeature} />;
}
