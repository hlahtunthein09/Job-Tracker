"use client";

import { signOut } from "@/lib/auth/auth-client";
import { useEffect } from "react";

const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000; // 24 hours;
const STORAGE_KEY = "lastActiveAt";

export default function InactivityMonitor(){
    useEffect(() => {
        let throttleTimer: ReturnType<typeof setTimeout> | null = null;

        const doSignOut = () => {
            signOut().catch(() => {
                // fallback redirect if signOut fails
                window.location.href = "/sign-in";
            });
        };

        const checkInactivity = () => {
            const lastActive = localStorage.getItem(STORAGE_KEY);
            if(lastActive)
            {
                const inactiveTime = Date.now() - parseInt(lastActive, 10);
                if(inactiveTime > INACTIVITY_LIMIT)
                {
                    localStorage.removeItem(STORAGE_KEY);
                    doSignOut();
                    return;
                }

            }
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        };

        const updateLastActive = () => {

            if(throttleTimer) return;

            throttleTimer = setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
                throttleTimer = null;
            }, 5000); // Throttle to once per second
        };

        // Check immediately on mount ( catches users returning after 24 hours)
        checkInactivity();

        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, updateLastActive));

        // Also check every minute in case no events fire
        const interval = setInterval(checkInactivity, 60 * 1000);

        return () => {
            events.forEach((event) => window.removeEventListener(event, updateLastActive));
            clearInterval(interval);
            if(throttleTimer) {
                clearTimeout(throttleTimer);
            }
        };
    }, []);

    return null;
}