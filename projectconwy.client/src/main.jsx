import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

const pca = new PublicClientApplication(msalConfig);



async function bootstrap() {
    try {
        ReactDOM.createRoot(document.getElementById("root")).render(
            <React.StrictMode>
                <App pca={pca} />
            </React.StrictMode>
        );
    } catch (err) {
        console.error("MSAL initialization failed", err);
    }
}

bootstrap();