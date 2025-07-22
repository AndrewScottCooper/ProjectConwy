import React from 'react';
import Button from '@mui/material/Button';
import styles from './NavBar.module.css';


export default function Navbar({ onSelect }) {
    return (
        <nav className={styles.sidebar} >
            <ul>
                <li> <Button
                    variant="contained"
                    onClick={() => onSelect('home')}
                    sx={{
                        backgroundColor: '#808080',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6a0dad',
                        },
                    }}
                >
                    Home
                </Button></li>

                <li><Button
                    variant="contained"
                    onClick={() => onSelect('map')}
                    sx={{ backgroundColor: '#808080', '&:hover': { backgroundColor: '#6a0dad' } }}
                >Maps</Button></li>

                <li><Button
                    variant="contained"
                    onClick={() => onSelect('homeestimates')}
                    sx={{ backgroundColor: '#808080', '&:hover': { backgroundColor: '#6a0dad' } }}
                >Home Estimates</Button></li>


                <li><Button
                    variant="contained"
                    onClick={() => onSelect('machinelearning')}
                    sx={{ backgroundColor: '#808080', '&:hover': { backgroundColor: '#6a0dad' } }}
                >Machine Learning</Button></li>

                <li><Button
                    variant="contained"
                    onClick={() => onSelect('about')}
                    sx={{ backgroundColor: '#808080', '&:hover': { backgroundColor: '#6a0dad' } }}
                >About</Button></li>
            
            </ul>
         </nav>
    )
};
