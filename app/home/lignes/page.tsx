"use client";

import React from "react";

export default function Lignes() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            {/* Container */}
            <div className="w-full max-w-5xl h-90% border border-black/15 dark:border-white/15 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md transition-colors flex flex-col items-center mt-15 ">
                {/* Titre */}
                <h1 className="text-xl font-bold text-start w-full">
                    Créateur de lignes
                </h1>

                {/* Ligne sous le titre */}
                <div className="w-full h-[0.5px] bg-black/15  my-4 "></div>

                {/* Image */}
                <div className="flex-1 w-full flex items-center justify-center">
                    <img
                        src="/terrain.png"
                        alt="Illustration"
                        className="max-h-full max-w-full object-contain rounded-[80px] bg-[#89FBFF]/20"
                    />

                </div>
            </div>
        </div>
    );
}
