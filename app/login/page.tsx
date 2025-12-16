"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Erreur lors de la connexion");
                return;
            }

            localStorage.setItem("isLoggedIn", "true");
            router.push("/home");
        } catch (err) {
            console.error(err);
            setError("Erreur serveur");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-10 relative bg-[#F0F0F0] dark:bg-gray-900 transition-colors">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm transition-colors">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <img src="/club.png" alt="Logo" className="h-32 w-32 object-contain mx-auto mb-4"/>

                <label className="block mb-2 text-black dark:text-white">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-black/15 dark:border-white/40 rounded text-black dark:text-white dark:bg-gray-700"
                    required
                />

                <label className="block mb-2 text-black dark:text-white">Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-6 border border-black/15 dark:border-white/40 rounded text-black dark:text-white dark:bg-gray-700"
                    required
                />

                <button type="submit" className="w-full text-white p-2 rounded transition bg-black dark:bg-gray-900 cursor-pointer">
                    Se connecter
                </button>
            </form>
        </div>
    );
}
