import React from 'react';
import './App.css';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import MainPage from "./MainPage";





function App({pca}) {
    return (
        <MsalProvider instance={pca}>
        <MainPage />
        </MsalProvider>
            
    );
}

export default App;