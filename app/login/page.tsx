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

            // Connexion réussie
            localStorage.setItem("isLoggedIn", "true");
            router.push("/home");

        } catch (err) {
            console.error(err);
            setError("Erreur serveur");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-10" style={{
            background: "linear-gradient(to bottom, #112541, #E91B22)"
        }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
            >

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <label className="block mb-2 font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    required
                />

                <label className="block mb-2 font-medium">Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-6 border rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full text-white p-2 rounded transition "
                    style={{
                        background: "linear-gradient(to right, #112541, #E91B22)"
                    }}
                >
                    Se connecter
                </button>

            </form>
        </div>
    );
}
