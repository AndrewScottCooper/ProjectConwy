import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import StateBoundary from './map_components/StateBoundary';
import CountyPriceComparison from './map_components/CountyPriceComparison';
//import L from 'leaflet';
import { useState } from 'react';



export default function Map() {
    const [mode, setMode] = useState('county')


    return (
        <div>
            <h1> MAP</h1>

            <select value={mode} onChange={e => setMode(e.target.value) }>
                <option value="county"> Counties </option>
                <option value="state"> States </option>
            </select>

            <MapContainer
                center={[37.98, -84.20]}
                zoom={10}
                style={{height:700, 
            width:700,
            margin: '0 auto',
            display: 'block',
            }}
            >
                <TileLayer
                    attribution="Scott Cooper 2025"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mode === 'county' && <CountyPriceComparison />}
                {mode === 'state' && <StateBoundary />}
            </MapContainer>
        </div>

     
    );
}