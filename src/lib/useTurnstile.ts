// src/lib/useTurnstile.ts
import { useEffect, useState } from 'react';

export function useTurnstile() {
    const [ready, setReady] = useState<boolean>(!!window.turnstile);

    useEffect(() => {
        if (window.turnstile) return; // already loaded (avoid double insert in StrictMode)
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.defer = true;
        s.onload = () => setReady(true);
        document.head.appendChild(s);
        // keep the script for the lifetime of the app
    }, []);

    return { ready, turnstile: window.turnstile };
}