import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CountyPriceComparison from "./map_components/CountyPriceComparison";
import StateBoundry from "./map_components/StateBoundary"; 

export default function Map() {
    const [mode, setMode] = useState("state"); // default to state view (loads faster doesn't need to connect to azure like counties does)
    const [map, setMap] = useState(null);

    // Recenter/zoom per mode for a nicer UX
    useEffect(() => {
        if (!map) return;
        if (mode === "state") map.setView([39.5, -98.35], 4);         // US view
        if (mode === "county") map.setView([37.98, -84.20], 8);       // Kentucky
    }, [mode, map]);

    // Simple styles will probably make a css file for these
    const card = {
        position: "relative",
        maxWidth: 1100,
        margin: "0 auto",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: "#fff",
    };

    const mapStyle = {
        height: "70vh",
        minHeight: 520,
        width: "100%",
        display: "block",
    };

    const overlay = {
        position: "absolute",
        zIndex: 1000,
        top: 12,
        left: 12,
        background: "rgba(255,255,255,0.95)",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        padding: 6,
        display: "flex",
        gap: 4,
        alignItems: "center",
        backdropFilter: "blur(2px)",
    };

    const btnBase = {
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 14,
        cursor: "pointer",
        lineHeight: 1,
    };

    const btnActive = {
        ...btnBase,
        background: "#0ea5e9",
        borderColor: "#0ea5e9",
        color: "#fff",
        boxShadow: "0 1px 4px rgba(14,165,233,0.35)",
    };

    return (
        <div style={{ padding: "24px 20px" }}>
            <h1 style={{ fontSize: 40, margin: "0 0 16px 0", color: "#0f172a" }}>Big Data Based Maps:</h1>

            <div style={card}>
                {/* floating control to change map modes inside the map */}
                <div style={overlay}>
                    <span style={{ fontSize: 12, color: "#475569", padding: "0 4px" }}>Mode:</span>
                    <button
                        style={mode === "state" ? btnActive : btnBase}
                        onClick={() => setMode("state")}
                        aria-pressed={mode === "state"}
                    >
                        States
                    </button>
                    <button
                        style={mode === "county" ? btnActive : btnBase}
                        onClick={() => setMode("county")}
                        aria-pressed={mode === "county"}
                    >
                        Counties
                    </button>
                </div>

                <MapContainer
                    whenCreated={setMap}
                    zoomControl={false} 
                    center={[39.5, -98.35]}
                    zoom={4}
                    style={mapStyle}
                >
                    <ZoomControl position="topright" /> 
                    <TileLayer
                        attribution="Scott Cooper 2025"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mode === "county" && <CountyPriceComparison />}
                    {mode === "state" && <StateBoundry />}
                </MapContainer>
            </div>
        </div>
    );
}
