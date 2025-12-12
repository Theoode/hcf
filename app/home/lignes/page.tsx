"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

interface Utilisateur {
    id_utilisateur: number;
    prenom: string;
    nom: string;
    numero: string;
}

export default function TerrainFullScreen() {
    const [isPortrait, setIsPortrait] = useState(false);
    const [joueurs, setJoueurs] = useState<Utilisateur[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<{ player: Utilisateur; fromRow: number; fromCol: number } | null>(null);

    const [gridPlayers, setGridPlayers] = useState<(Utilisateur | null)[][]>([
        [null, null, null],
        [null, null, null],
    ]);

    // Layout de la grille
    const gridLayout = useMemo(
        () => [
            { row: 0, col: 0, rowSpan: 1 },
            { row: 0, col: 1, rowSpan: 2 },
            { row: 0, col: 2, rowSpan: 1 },
            { row: 1, col: 0, rowSpan: 1 },
            { row: 1, col: 2, rowSpan: 1 },
        ],
        []
    );

    // Orientation
    useEffect(() => {
        const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch joueurs optimisé
    const fetchJoueurs = useCallback(async () => {
        if (joueurs.length > 0) return;

        try {
            const res = await fetch("/api/utilisateurs", { cache: "no-store" });
            if (!res.ok) throw new Error("Erreur fetch joueurs");

            const data = await res.json();
            setJoueurs(data);
        } catch (error) {
            console.error("Erreur récupération utilisateurs :", error);
        }
    }, [joueurs.length]);

    // Click cellule pour ajouter ou déplacer
    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            const player = gridPlayers[row][col];

            if (player) {
                // Sélection d'un joueur pour déplacement
                setSelectedPlayer({ player, fromRow: row, fromCol: col });
            } else if (selectedPlayer) {
                // Déplacer joueur sélectionné
                setGridPlayers((prev) => {
                    const updated = prev.map((inner) => [...inner]);
                    updated[selectedPlayer.fromRow][selectedPlayer.fromCol] = null;
                    updated[row][col] = selectedPlayer.player;
                    return updated;
                });
                setSelectedPlayer(null);
            } else {
                // Ouvrir modal pour ajouter joueur
                setSelectedCell({ row, col });
                await fetchJoueurs();
                setOpenModal(true);
            }
        },
        [gridPlayers, selectedPlayer, fetchJoueurs]
    );

    // Sélection joueur depuis modal
    const handleSelectPlayer = useCallback(
        (u: Utilisateur) => {
            if (!selectedCell) return;
            const { row, col } = selectedCell;

            setGridPlayers((prev) => {
                const updated = prev.map((inner) => [...inner]);
                updated[row][col] = u;
                return updated;
            });

            setOpenModal(false);
        },
        [selectedCell]
    );

    // Supprimer joueur
    const handleRemovePlayer = useCallback((row: number, col: number) => {
        setGridPlayers((prev) => {
            const updated = prev.map((inner) => [...inner]);
            updated[row][col] = null;
            return updated;
        });

        // Si on supprimait le joueur sélectionné
        if (selectedPlayer && selectedPlayer.fromRow === row && selectedPlayer.fromCol === col) {
            setSelectedPlayer(null);
        }
    }, [selectedPlayer]);

    return (
        <main className="w-full h-screen bg-gray-800 flex items-center justify-center relative">
            {/* Overlay portrait */}
            {isPortrait && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4 z-50">
                    <p className="text-lg sm:text-2xl font-bold">
                        Veuillez tourner votre téléphone en paysage
                    </p>
                </div>
            )}

            {/* Terrain */}
            {!isPortrait && (
                <div className="relative max-w-[100vw] max-h-[100vh]">
                    <img src="/terrain.png" alt="Terrain" className="w-full h-full object-cover" />

                    {/* Grille */}
                    <div className="absolute top-[10%] left-[20%] w-[60%] h-[70%] mt-5">
                        <div className="grid grid-cols-3 grid-rows-2 w-full h-full place-items-center justify-items-center gap-3.5">
                            {gridLayout.map(({ row, col, rowSpan }, index) => {
                                const player = gridPlayers[row][col];
                                const cellClasses = rowSpan === 2 ? "row-span-2 w-1/2 h-1/2" : "w-1/2 h-full";

                                return (
                                    <div
                                        key={index}
                                        className={` border-2 border-white rounded-2xl  bg-[rgba(217,217,217,0.5)]  relative flex items-center justify-center [box-shadow:0_4px_4px_2px_rgba(0,238,255,0.5)] ${cellClasses}`}
                                    >
                                        {/* Case clicable */}
                                        <button
                                            onClick={() => handleCellClick(row, col)}
                                            className="absolute inset-0 hover:bg-white/20 transition"
                                        />

                                        {/* Indication joueur sélectionné */}
                                        {selectedPlayer && selectedPlayer.fromRow === row && selectedPlayer.fromCol === col && (
                                            <div className="absolute inset-0 border-4 border-cyan-400 rounded-2xl pointer-events-none" />
                                        )}

                                        {/* + pour ajouter joueur */}
                                        {!player && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold pointer-events-none">
                                                +
                                            </div>
                                        )}

                                        {/* Joueur existant */}
                                        {player && (
                                            <>
                                                <div
                                                    className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/60 rounded-2xl z-10 cursor-pointer"
                                                    onClick={() => setSelectedPlayer({ player, fromRow: row, fromCol: col })}
                                                >
                                                    <span className="text-base sm:text-lg font-bold">{player.prenom} {player.nom}</span>
                                                    <span className="text-sm sm:text-base">#{player.numero}</span>
                                                </div>

                                                <button
                                                    onClick={() => handleRemovePlayer(row, col)}
                                                    className="
                            absolute top-1 right-1 z-20 w-6 h-6
                            flex items-center justify-center
                            bg-red-600 text-white rounded-full
                            text-sm font-bold hover:bg-red-700
                          "
                                                >
                                                    X
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal sélection joueur */}
            {openModal && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md w-[400px] max-h-[70vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-3 text-center">Sélection d’un joueur</h2>

                        {selectedCell && (
                            <p className="text-sm mb-2 text-gray-600 text-center">
                                Case : L {selectedCell.row + 1} / C {selectedCell.col + 1}
                            </p>
                        )}

                        <ul className="divide-y">
                            {joueurs.map((u) => (
                                <li
                                    key={u.id_utilisateur}
                                    className="py-2 hover:bg-gray-100 cursor-pointer px-2"
                                    onClick={() => handleSelectPlayer(u)}
                                >
                                    {u.prenom} {u.nom} (#{u.numero})
                                </li>
                            ))}
                        </ul>

                        <button
                            className="mt-4 w-full bg-red-600 text-white py-2 rounded"
                            onClick={() => setOpenModal(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
