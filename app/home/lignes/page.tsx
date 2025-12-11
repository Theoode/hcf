"use client";

import { useEffect, useState } from "react";

export default function TerrainFullScreen() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        handleResize(); // Vérifie l'orientation au chargement
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <main className="w-full h-screen bg-gray-800 flex items-center justify-center relative">
            {isPortrait && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4 z-50">
                    <p className="text-lg sm:text-2xl font-bold">
                        Veuillez tourner votre téléphone en paysage
                    </p>
                </div>
            )}

            {!isPortrait && (
                <img
                    src="/terrain.png"
                    alt="Terrain"
                    className="max-w-[90vw] max-h-[90vh] object-cover"
                />
            )}
        </main>
    );
}
