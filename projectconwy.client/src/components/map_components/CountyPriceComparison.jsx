import { useEffect, useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import fipsToState from '../../utils/fipsToState';


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
        const state = feature.properties.STATE; 
        layer.bindPopup(`<b>${name}, ${fipsToState[state]}<b>`);
    }

    if (!geoData) return null;

    return <GeoJSON data={geoData} onEachFeature={onEachFeature} />;
}
