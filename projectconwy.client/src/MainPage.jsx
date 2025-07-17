import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useEffect } from "react";

export default function MainPage() {
    const { instance, accounts } = useMsal();

    useEffect(() => {
        if (accounts.length === 0) {
            instance.loginRedirect(loginRequest);
        }
    }, [accounts, instance]);

    if (accounts.length === 0) {
        return <p>Redirecting to Microsoft Login...</p>
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