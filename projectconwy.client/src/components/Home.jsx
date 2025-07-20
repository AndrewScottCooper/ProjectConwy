import React from 'react';
import styles from './Home.module.css'

export default function Home() {
    return (
     
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>

            <div className={styles.cardRow}>
                <div className={styles.card}>New Messages</div>
                <div className={styles.card}>System Updates</div>
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Notifications</div>
                <div className={styles.card}>Notifications</div>
            </div>

            <div className={styles.chartSection}>  
                <p>[Charts and fun stuff UwU ]</p>
                </div>
            </div>
 
    );
}