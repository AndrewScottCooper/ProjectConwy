import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useEffect, useState } from "react";

export default function MainPage() {
    const { instance, accounts } = useMsal();
    const [hasRedirectBeenHandled, setHasRedirectBeenHandled] = useState(false);

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

    return (
        <div className="App">
            <header>
                <h1>Welcome to Project Conwy</h1>
            </header>
            <main>
                <p>This is where the fun begins.</p>
            </main>
        </div>);
}