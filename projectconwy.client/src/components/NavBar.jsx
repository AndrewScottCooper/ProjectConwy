import React from 'react';

export default function Navbar({ onSelect }) {
    return (
        <nav style={{ width: "200px", background: "#eee", padding: "1rem" }} >
            <ul>
                <li><button onClick={() => onSelect('home')}>Home</button></li>
                <li><button onClick={() => onSelect('map')}>Maps</button></li>
                <li><button onClick={() => onSelect('about')}>About</button></li>
            </ul>
         </nav>
    )
};
