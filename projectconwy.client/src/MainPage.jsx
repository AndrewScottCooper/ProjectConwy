import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Map from "./components/Map";
import About from "./components/About";

export default function MainPage() {
    const { instance, accounts } = useMsal();
    const [hasRedirectBeenHandled, setHasRedirectBeenHandled] = useState(false);
    const [activeComponent, setActiveComponent] = useState('home');

    useEffect(() => {
        instance.handleRedirectPromise().then(response => {
            if (response && response.account) {
                instance.setActiveAccount(response.account);
            }
            setHasRedirectBeenHandled(true);
        }).catch(err => {
            console.error("Redirect handling failed, imma fucking kms", err);
            setHasRedirectBeenHandled(true);
        });
    }, [instance]);


    useEffect(() => {
        if (hasRedirectBeenHandled && accounts.length === 0) {
            instance.loginRedirect(loginRequest);
        }
    }, [accounts, hasRedirectBeenHandled, instance]);

    if (!hasRedirectBeenHandled) {
        return <p>Loading...</p>;
    }

    if (accounts.length === 0) {
        return <p>Redirecting to Microsoft Login...</p>;
    }

    const RenderMainContent = () => {
        switch (activeComponent) {
            case 'home': return <Home />;
            case 'map': return <Map />;
            case 'about': return <About/>
            default: return < Home />;
        }
    };

    return (
        <div className="App">
            <NavBar onSelect={setActiveComponent} />
            <main style={{ flex: 1, padding: '1rem' }}>
                {RenderMainContent()}
            </main>
        </div>);
}