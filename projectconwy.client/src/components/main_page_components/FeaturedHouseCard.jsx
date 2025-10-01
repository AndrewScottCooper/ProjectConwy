import { useEffect, useState } from "react";

export default function FeaturedHouseCard({ state = "KY" }) {
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        setLoading(true);
        fetch(`/api/real-listings/random?state=${encodeURIComponent(state)}`, {
            signal: ac.signal,
        })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(json => { setData(json); setErr(""); })
            .catch(e => { if (e.name !== "AbortError") setErr(e.message || "Failed"); })
            .finally(() => setLoading(false));
        return () => ac.abort();
    }, [state]);

    if (loading) return <div className="card">Loading featured house…</div>;
    if (err) return <div className="card">Couldn’t load: {err}</div>;
    if (!data) return <div className="card">No featured house found.</div>;

    const img = (data.images && data.images[0]) || data.heroImageUrl || "/placeholder.jpg";

    return (
        <a className="card featured-house" href={`/listings/${data.id}`}>
            <div className="thumb" style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 8 }}>
                <img
                    src={img}
                    alt={`${data.addressLine1 || data.city}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                />
            </div>
            <div className="body">
                <div style={{ fontWeight: 600, marginTop: 8 }}>
                    {data.addressLine1 ?? `${data.city}, ${data.stateCode}`}
                </div>
                <div style={{ opacity: 0.8 }}>
                    {data.city}, {data.stateCode} {data.postalCode}
                </div>
                <div style={{ marginTop: 6 }}>
                    ${data.priceUSD?.toLocaleString?.() ?? "—"} / {data.bedrooms ?? "—"} bd / {data.bathrooms ?? "—"} ba / {data.squareFeet ?? "—"} sqft
                </div>
            </div>
        </a>
    );
}