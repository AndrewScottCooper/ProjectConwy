import React from 'react';
import Button from '@mui/material/Button';


export default function Navbar({ onSelect }) {
    return (
        <nav style={{ width: "200px", background: "#eee", padding: "1rem" }} >
            <ul>
                <li> <Button
                    variant="contained"
                    onClick={() => onSelect('home')}
                >
                    Home
                </Button></li>

                <li><Button onClick={() => onSelect('map')}>Maps</Button></li>
                <li><Button onClick={() => onSelect('about')}>About</Button></li>
            </ul>
         </nav>
    )
};
