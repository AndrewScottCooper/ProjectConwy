import React, { useEffect, useState } from 'react';
import styles from './Home.module.css'


export default function Home() {
    const [listing, setListing] = useState(null);

    useEffect(() => {
        fetch("/api/LargeRealEstateListings/221996")
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setListing(data);
                console.log(data); // For debug
            })
            .catch(err => {
                console.log("Fetch error:", err);
            });
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
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Notifications</div>
            </div>

            <div className={styles.chartSection}>  
                <p>[Charts and fun stuff UwU]</p>
            </div>
        </div>
    );
}