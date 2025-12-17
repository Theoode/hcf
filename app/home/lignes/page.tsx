"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Lignes() {
    const router = useRouter();
    const [joueurs, setJoueurs] = useState(5);


    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        alert(`Ligne enregistrée avec ${joueurs} joueurs !`);
    };


    return (
        <div className="min-h-screen bg-[#F7F7F7] p-4 sm:p-6 lg:p-8">
            {/* Bouton Retour */}
            <button onClick={handleBack} className="mb-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors sm:text-xl">
                Retour
            </button>

            {/* Container */}
            <div className="w-full max-w-5xl h-[85vh] sm:h-[85vh] md:h-[80vh] border border-black/15 rounded-xl p-4 sm:p-6 lg:p-8 bg-white  shadow-md flex
            flex-col mt-2 overflow-hidden">
                {/* Titre */}
                <h1 className="text-l sm:text-xl font-semibold text-start dark:text-gray-100 mb-2">
                    Créateur de lignes
                </h1>
                <div className="w-full h-[2px] bg-black/20 dark:bg-white/20 mb-4"></div>

                {/* Dropdown + bouton */}
                <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
                    <select
                        value={joueurs}
                        onChange={(e) => setJoueurs(Number(e.target.value))}
                        className="p-2 border text-l border-black/20 dark:border-white/20 bg-white dark:text-white rounded-3xl w-full sm:w-1/3 "
                    >
                        <option value={5}>Jeu à 5</option>
                        <option value={4}>Jeu à 4</option>
                        <option value={3}>Jeu à 3</option>
                    </select>
                </div>

                {/* Wrapper image + grille */}

                <div className="flex justify-center items-center p-8 sm:p-48 w-full overflow-hidden">
                    <div className="relative inline-block max-w-full max-h-[calc(100vh-200px)]">
                        {/* Image */}
                        <Image
                            src="/terrain.png"
                            alt="TerrainHockey"
                            width={1308}
                            height={648}
                            className="block w-full h-auto object-contain bg-[#89FBFF]/30 rounded-[62px]"
                            priority
                        />

                        {/* Grille 3x2 */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 pointer-events-none mt-18 mb-18 ml-12 mr-12 gap-20">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="border border-white rounded-[10px] bg-[#1E1E1E]/90 shadow-[0_0_4px_2px_rgba(30,30,30,0.66)]"
                                ></div>

                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="px-4 py-2 w-full sm:w-auto text-white bg-green-400 font-medium  rounded-3xl bg-green-40 sm:text-xl transition-colors">
                    Enregistrer la ligne
                </button>

            </div>

            <div className="w-full max-w-5xl h-[20vh] sm:h-[85vh] md:h-[80vh] border border-black/15 rounded-xl p-4 sm:p-6 lg:p-8 bg-white  shadow-md flex
            flex-col overflow-hidden mt-8">

                <div className="flex flex-col">
                    <h1 className="text-l sm:text-xl font-semibold text-start dark:text-gray-100 ">
                        Lignes enregistrées
                    </h1>
                    <h3 className="text-l sm:text-xl font-semibold text-start opacity-50 ">
                        Lignes enregistrées pour ce match
                    </h3>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-l sm:text-xl font-semibold text-start opacity-50 "></h1>
                </div>




            </div>
        </div>
    );
}
