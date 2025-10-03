import React, { useEffect, useState } from 'react';
import styles from './Home.module.css'
import FeaturedHouseCard from "../components/main_page_components/FeaturedHouseCard";


export default function Home() {
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        console.time("KY fetch");

        fetch("/api/LargeRealEstateListings/state/Kentucky?page=1&pageSize=1", {
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();             
            })
            .then(rows => {
                const first = rows?.[0] || null;
                setListing(first);             
                console.timeEnd("KY fetch");
                console.log(first);
            })
            .catch(err => console.error("Fetch error:", err));

        return () => controller.abort();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>

            <div>
                {listing ? (
                    <pre>{JSON.stringify(listing, null, 2)}</pre>
                ) : (
                    <p>Loading (or not found)...</p>
                )}
            </div>

            <div className={styles.cardRow}>
                <div className={styles.card}>New Messages</div>
                <div className={styles.card}>System Updates</div>
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Featured Home:
                    <FeaturedHouseCard state="KY" />
                </div>
                <div className={styles.card}> Something more interesting here</div>
                <div className={styles.card}>AAAAA
                <p> This will be a real feature soon. If you see this you're pretty early and please come back to see when its more fleshed out.</p>
                </div>
            </div>

            <div className={styles.chartSection}>  
                <p>[Charts and fun stuff please come back later]</p>
            </div>
        </div>
    );
}