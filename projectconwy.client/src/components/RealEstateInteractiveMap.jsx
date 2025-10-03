import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from "react";
import {Marker, Popup, useMapEvents, } from "react-leaflet";


function useDebouncedEffect(effect, deps, delay = 300) {
    const timeoutRef = useRef();
    useEffect(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(effect, delay);
        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

function BboxWatcher({ onChange }) {
    const map = useMapEvents({
        moveend() {
            const b = map.getBounds();
            onChange({
                west: b.getWest(),
                south: b.getSouth(),
                east: b.getEast(),
                north: b.getNorth(),
                zoom: map.getZoom(),
            });
        },
    });

    // fire once on mount with initial bounds
    useEffect(() => {
        const b = map.getBounds();
        onChange({
            west: b.getWest(),
            south: b.getSouth(),
            east: b.getEast(),
            north: b.getNorth(),
            zoom: map.getZoom(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}


export default function RealEstateInteractiveMap() {
    const [bbox, setBbox] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [error, setError] = useState("");



    // fetch when bbox changes (debounced)
    useDebouncedEffect(() => {
        if (!bbox) return;

        const url = new URL("/api/real-listings", window.location.origin);
        url.searchParams.set("west", bbox.west);
        url.searchParams.set("south", bbox.south);
        url.searchParams.set("east", bbox.east);
        url.searchParams.set("north", bbox.north);
        url.searchParams.set("take", 300);

        fetch(url)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                setMarkers(Array.isArray(data) ? data : []);
                setError("");
            })
            .catch(err => setError(err.message || "Failed to load"));
    }, [bbox], 300);

    return (
        <div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossorigin="" />
            <h1>Current Listings</h1>
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>Error: {error}</div>}

            <MapContainer
                center={[37.98, -84.48]}
                zoom={11}
                style={{
                    height: 1000,
                    width: 1000,
                    margin: "0 auto",
                    display: "block",
                }}
            >
                <TileLayer
                    attribution="Scott Cooper 2025"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <BboxWatcher onChange={setBbox} />


                {markers.map(m => (
                    <Marker key={m.id} position={[Number(m.latitude), Number(m.longitude)]}>
                        <Popup>
                            <div style={{ width: 240 }}>
                                {m.heroImageUrl && (
                                    <img
                                        src={m.heroImageUrl}
                                        alt=""
                                        loading="lazy"
                                        style={{
                                            width: "100%",
                                            aspectRatio: "3 / 2",
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            display: "block",
                                            marginBottom: 6,
                                        }}
                                    />
                                )}

                                <div style={{ fontWeight: 700 }}>
                                    {m.priceUSD != null ? `$${m.priceUSD.toLocaleString()}` : "—"}
                                </div>
                                <div style={{ fontSize: 12, color: "#555" }}>
                                    {(m.bedrooms ?? "—")} bd / {(m.bathrooms ?? "—")} ba / {(m.squareFeet ?? "—")} sqft
                                </div>
                                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                                    {m.addressLine1}, {m.city ?? ""} {m.stateCode}
                                </div>

                                {/* Link to a full details page... Dreading doing this
                                    I dont want to do routing but doing a single page would kinda mess the user up on wanting to go back.
                                    Maybe I have a button that takes them back to this map? That'd probably be my fastest way to ship this feature
                                */}
                               
                                <div style={{ marginTop: 6 }}>
                                    <a href={`/listing/${m.id}`}>View details</a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}