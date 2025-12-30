"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import GrilleJoueurs from "@/components/GrilleJoueur";
import { Ligne } from "@/app/types/lignes";
import { Joueur } from "@/app/types/joueurs";

interface MatchData {
    id_match: number;
    date_match: string;
    lieu?: string;
    score_domicile: number;
    score_exterieur: number;
    Lignes: Ligne[];
    Categorie: { nom: string };
}

export default function Lignes() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const matchIdParam = searchParams.get("matchId");
    const matchId = matchIdParam ? parseInt(matchIdParam, 10) : null;

    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const [assignations, setAssignations] = useState<Record<number, Joueur>>({});
    const [joueurs, setJoueurs] = useState<number>(5);
    const [lignesEnregistrees, setLignesEnregistrees] = useState<Ligne[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Redirection si matchId absent
    useEffect(() => {
        if (!matchId) router.replace("/home/choix-match");
    }, [matchId, router]);

    // Fetch du match
    useEffect(() => {
        if (!matchId) return;

        const fetchMatch = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/match/${matchId}`);
                const data = await res.json();

                if (data.success) {
                    const match: MatchData = {
                        ...data.data,
                        Lignes: data.data.Lignes || [], // normalisation
                    };
                    setMatchData(match);
                    setLignesEnregistrees(match.Lignes.filter(l => l.positions?.joueurs?.length));
                    setError(null);
                } else {
                    setError(data.message || "Erreur récupération match");
                }
            } catch (err) {
                console.error(err);
                setError("Erreur réseau");
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [matchId]);

    // Utils
    const getVisibleCases = (joueurs: number) => {
        if (joueurs === 3) return [5, 7, 9];
        if (joueurs === 4) return [4, 5, 6, 8];
        return [1, 3, 5, 7, 9];
    };

    const getRoleByCase = (idCase: number, joueurs: number): "A" | "D" | "C" => {
        if ([1, 3, 6].includes(idCase)) return "A";
        if ([4, 7, 8, 9].includes(idCase)) return "D";
        if (idCase === 5) return joueurs === 5 ? "C" : "A";
        return "A";
    };

    // Handlers
    const handleSave = async () => {
        if (!matchId) return;

        const visibleCases = getVisibleCases(joueurs);
        const missing = visibleCases.filter((id) => !assignations[id]);
        if (missing.length) {
            alert("Tous les postes visibles doivent être remplis");
            return;
        }

        const positions = {
            format: joueurs as 3 | 4 | 5,
            joueurs: visibleCases.map((idCase) => ({
                case: idCase,
                role: getRoleByCase(idCase, joueurs),
                joueur: assignations[idCase],
            })),
        };

        try {
            const res = await fetch("/api/lignes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId, positions }),
            });
            const data = await res.json();
            if (data.success) {
                alert("Ligne sauvegardée !");
                setAssignations({});
                setLignesEnregistrees((prev) => [...prev, data.ligne]);
            } else {
                alert(data.message || "Erreur sauvegarde");
            }
        } catch {
            alert("Erreur réseau");
        }
    };

    const handleDeleteLigne = async (id_ligne: number) => {
        if (!confirm("Supprimer cette ligne ?")) return;

        try {
            const res = await fetch(`/api/lignes/${id_ligne}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setLignesEnregistrees((prev) => prev.filter((l) => l.id_ligne !== id_ligne));
            } else {
                alert(data.error || "Erreur suppression");
            }
        } catch {
            alert("Erreur réseau");
        }
    };


    const handleLoadLigne = (ligne: Ligne) => {
        if (!ligne?.positions?.joueurs) return;
        const loaded: Record<number, Joueur> = {};
        ligne.positions.joueurs.forEach((pos) => {
            if (pos.case && pos.joueur) loaded[pos.case] = pos.joueur;
        });
        setJoueurs(ligne.positions.format);
        setAssignations(loaded);
    };

    const handleBack = () => router.back();
    const handleClearGrille = () => setAssignations({});
    const handleChangeFormat = (value: number) => {
        setJoueurs(value);
        handleClearGrille();
    };

    // Render
    if (!matchId) return null;
    if (loading) return <p>Chargement du match...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!matchData) return <p>Match introuvable.</p>;

    return (
        <div className="min-h-screen bg-[#F7F7F7] p-4 sm:p-6 lg:p-8 ">
            <button onClick={handleBack} className="mb-4 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors sm:text-xl">
                Retour
            </button>

            <div className="w-full  h-[85vh] border border-black/15 rounded-xl p-4 bg-white shadow-md flex flex-col mt-2 overflow-hidden">
                <h1 className="text-l sm:text-xl font-semibold mb-2">
                    Créateur de lignes - {matchData.Categorie.nom}
                </h1>
                <div className="w-full h-[2px] bg-black/20 mb-4"></div>

                <div className="w-full flex flex-col sm:flex-row justify-between gap-2 mb-4">
                    <select
                        value={joueurs}
                        onChange={(e) => handleChangeFormat(Number(e.target.value))}
                        className="p-2 border text-l border-black/20 bg-white rounded-3xl w-full sm:w-1/3"
                    >
                        <option value={5}>Jeu à 5</option>
                        <option value={4}>Jeu à 4</option>
                        <option value={3}>Jeu à 3</option>
                    </select>
                </div>

                <div className="flex items-center justify-center p-8 sm:p-48 w-full h-full overflow-hidden ">
                    <div className="relative mx-auto flex items-center justify-center  lg:rotate-90">
                        <Image
                            src="/terrain.png"
                            alt="TerrainHockey"
                            width={1308}
                            height={648}
                            className="block w-full h-auto object-contain bg-[#89FBFF]/30 rounded-[62px] lg:m-auto"
                            priority
                        />
                        <GrilleJoueurs
                            joueurs={joueurs}
                            assignations={assignations}
                            setAssignations={setAssignations}
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between gap-2">
                    <button onClick={handleSave} className="px-3 py-1.5 text-white bg-green-500 text-sm font-medium rounded-xl hover:bg-green-600 transition">
                        Enregistrer
                    </button>
                    <button onClick={handleClearGrille} className="px-3 py-1.5 text-white bg-gray-400 text-sm font-medium rounded-xl hover:bg-gray-500 transition">
                        Nettoyer
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl border border-black/15 rounded-xl p-4 bg-white shadow-md flex flex-col mt-8">
                <div className="flex flex-col mb-4">
                    <h1 className="text-l sm:text-xl font-semibold">Lignes enregistrées</h1>
                    <h3 className="text-l sm:text-xl font-semibold opacity-50">Lignes enregistrées pour ce match</h3>
                </div>

                {lignesEnregistrees.length === 0 ? (
                    <p className="text-gray-500">Aucune ligne enregistrée pour le moment.</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {lignesEnregistrees.map((ligne) => {
                            if (!ligne.positions) return null;
                            const nom = ligne.nom || `Ligne ${ligne.id_ligne}`;
                            const format = ligne.positions.format ?? "?";
                            const joueursPositions = ligne.positions.joueurs ?? [];

                            return (
                                <li key={ligne.id_ligne} className="p-3 border rounded-md bg-gray-100 text-sm flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div className="font-semibold">{nom} – Jeu à {format}</div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleLoadLigne(ligne)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                                Charger
                                            </button>
                                            <button onClick={() => handleDeleteLigne(ligne.id_ligne)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {joueursPositions.map((pos) => (
                                            <span key={pos.case} className="px-2 py-1 bg-white border rounded-full text-xs">
                        {pos.role} – {pos.joueur?.prenom || "?"}
                      </span>
                                        ))}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
