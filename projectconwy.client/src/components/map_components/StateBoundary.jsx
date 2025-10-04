import { useEffect, useMemo, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet"; 

const fmtMoney = (n) =>
    typeof n === "number" ? `$${Math.round(n).toLocaleString()}` : "—";

function quantileBreaks(values) {
    if (!values.length) return [];
    const sorted = [...values].sort((a, b) => a - b);
    const q = (p) => {
        const idx = (sorted.length - 1) * p;
        const lo = Math.floor(idx);
        const hi = Math.ceil(idx);
        if (lo === hi) return sorted[lo];
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    };
    return [q(0.2), q(0.4), q(0.6), q(0.8)];
}

function Legend({ breaks, getColor, label = "Median price" }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !breaks?.length) return;
        const control = L.control({ position: "bottomright" });
        control.onAdd = function () {
            const div = L.DomUtil.create("div", "info legend");
            div.style.background = "white";
            div.style.padding = "8px 10px";
            div.style.borderRadius = "8px";
            div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            div.style.font = "14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

            const ranges = [0, ...breaks];
            const lines = [];
            for (let i = 0; i < ranges.length; i++) {
                const from = ranges[i];
                const to = breaks[i];
                const color = getColor(to ?? (from + 1));
                const text = to ? `${fmtMoney(from)} – ${fmtMoney(to)}` : `${fmtMoney(from)}+`;
                lines.push(
                    `<i style="background:${color}; width:14px; height:14px; display:inline-block; margin-right:6px; border:1px solid rgba(0,0,0,0.25)"></i>${text}`
                );
            }
            div.innerHTML = `<b>${label}</b><br>${lines.join("<br>")}`;
            return div;
        };
        control.addTo(map);
        return () => control.remove();
    }, [map, breaks, getColor, label]);

    return null;
}

export default function StatePriceChoropleth() {
    const [statesGeo, setStatesGeo] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch("/us_states_5m.json").then((r) => r.json()),
            fetch("/StateAverages.json").then((r) => r.json()),
        ]).then(([geo, statJson]) => {
            setStatesGeo(geo);
            setStats(statJson?.states || statJson);
        });
    }, []);

    const byName = useMemo(() => {
        if (!stats) return new Map();
        const m = new Map();
        for (const row of stats) {
            if (!row.State) continue;
            m.set(String(row.State).toUpperCase(), row);
        }
        return m;
    }, [stats]);

    const { breaks, getColor } = useMemo(() => {
        const metric = "median_price";
        const vals = stats
            ? stats.map((s) => Number(s[metric])).filter((n) => Number.isFinite(n) && n > 0)
            : [];
        const qs = quantileBreaks(vals);

        const colorScale = (v) => {
            if (!Number.isFinite(v)) return "#eeeeee";
            if (qs.length < 4) return "#c7e9c0";
            if (v <= qs[0]) return "#edf8e9";
            if (v <= qs[1]) return "#bae4b3";
            if (v <= qs[2]) return "#74c476";
            if (v <= qs[3]) return "#31a354";
            return "#006d2c";
        };
        return { breaks: qs, getColor: colorScale };
    }, [stats]);

    const style = (feature) => {
        const name = String(feature?.properties?.NAME || "").toUpperCase();
        const row = byName.get(name);
        const median = Number(row?.median_price);
        return {
            fillColor: getColor(median),
            weight: 1,
            opacity: 1,
            color: "#ffffff",
            dashArray: "3",
            fillOpacity: 0.75,
        };
    };

    const onEachFeature = (feature, layer) => {
        const name = String(feature?.properties?.NAME || "");
        const row = byName.get(name.toUpperCase());
        if (!row) {
            layer.bindPopup(`<b>${name}</b><br/>No data.`);
            return;
        }
        const lines = [
            `<b>${name}</b>`,
            `Listings: ${Number(row.n || 0).toLocaleString()}`,
            `Median: ${fmtMoney(Number(row.median_price))}`,
            `Average: ${fmtMoney(Number(row.avg_price))}`,
            `P25–P75: ${fmtMoney(Number(row.p25_price))} – ${fmtMoney(Number(row.p75_price))}`,
            `Min–Max: ${fmtMoney(Number(row.min_price))} – ${fmtMoney(Number(row.max_price))}`,
        ];
        layer.bindPopup(lines.join("<br/>"));
        layer.on({
            mouseover: (e) => {
                const l = e.target;
                l.setStyle({ weight: 2, color: "#333", dashArray: "" });
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) l.bringToFront();
            },
            mouseout: (e) => e.target.setStyle(style(feature)),
        });
    };

    const filteredGeo = useMemo(() => {
        if (!statesGeo || !stats) return null;
        const have = new Set(stats.map((s) => String(s.State || "").toUpperCase()));
        return {
            ...statesGeo,
            features: statesGeo.features.filter((f) =>
                have.has(String(f.properties?.NAME || "").toUpperCase())
            ),
        };
    }, [statesGeo, stats]);

    if (!filteredGeo) return null;

    return (
        <>
            <GeoJSON data={filteredGeo} style={style} onEachFeature={onEachFeature} />
            <Legend breaks={breaks} getColor={getColor} label="Median home price" />
        </>
    );
}

