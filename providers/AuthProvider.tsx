"use client";

import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        const handleFocus = async () => {
            try {
                await fetch("/api/auth/refresh", {
                    method: "GET",
                    credentials: "include"
                });
            } catch {
                window.location.href = "/login";
            }
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    return <>{children}</>;
}