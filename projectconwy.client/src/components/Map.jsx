import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//import L from 'leaflet';
//import { useEffect, useState } from 'react';



export default function Map() {
    return (
        <div>
            <h1> MAP</h1>

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
                
            </MapContainer>
        </div>

     
    );
}