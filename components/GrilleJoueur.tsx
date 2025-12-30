"use client";

import React, { useEffect, useState } from "react";
import { Joueur } from "@/app/types/joueurs";
import Modal from "@/components/Modal";

interface Props {
    joueurs: number;
    assignations: Record<number, Joueur>;
    setAssignations: React.Dispatch<React.SetStateAction<Record<number, Joueur>>>;
}

export default function GrilleJoueurs({ joueurs, assignations, setAssignations }: Props) {
    const totalCases = 9;

    const visibleCases = joueurs === 3 ? [5, 7, 9] :
        joueurs === 4 ? [4, 5, 6, 8] :
            [1, 3, 5, 7, 9];

    const handleRemoveJoueur = (idCase: number) => {
        setAssignations((prev) => {
            const copy = { ...prev };
            delete copy[idCase];
            return copy;
        });
    };


    const [users, setUsers] = useState<Joueur[]>([]);
    const [selectedCase, setSelectedCase] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch utilisateurs
    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/utilisateurs");
                const data = await res.json();
                if (!isMounted) return;

                if (Array.isArray(data)) setUsers(data);
                else if (data?.success && Array.isArray(data.data)) setUsers(data.data);
                else setUsers([]);
            } catch {
                if (isMounted) setUsers([]);
            }
        };
        fetchUsers();

        return () => { isMounted = false; };
    }, []);

    const getLabel = (idCase: number): string => {
        if ([1, 3, 6].includes(idCase)) return "A"; // Attaquant
        if ([4, 7, 8, 9].includes(idCase)) return "D"; // Défenseur
        if (idCase === 5) return joueurs === 5 ? "C" : "A"; // Centre
        return "";
    };

    const handleCaseClick = (idCase: number) => {
        if (!visibleCases.includes(idCase)) return;
        setSelectedCase(idCase);
        setIsModalOpen(true);
    };

    const handleSelectJoueur = (joueur: Joueur) => {
        if (selectedCase === null) return;

        const alreadyAssigned = Object.values(assignations).some(
            (j) => j.id_utilisateur === joueur.id_utilisateur
        );
        if (alreadyAssigned) {
            alert(`${joueur.prenom} est déjà assigné`);
            return;
        }

        setAssignations((prev) => ({
            ...prev,
            [selectedCase]: joueur,
        }));

        setSelectedCase(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 mt-22 mb-12 ml-8 mr-8 ">
                {Array.from({ length: totalCases }).map((_, index) => {
                    const idCase = index + 1;
                    const isVisible = visibleCases.includes(idCase);
                    const joueur = assignations[idCase];

                    return (
                        <div
                            key={idCase}
                            onClick={() => handleCaseClick(idCase)}
                            className={` relative border-white border-2 rounded-[10px] lg:h-3/5 lg:-rotate-90   bg-[#1E1E1E]/90 shadow-[0_0_4px_2px_rgba(0,0,0,0.6)] flex items-center justify-center transition-opacity ${isVisible ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`}
                        >
                            {joueur && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveJoueur(idCase);
                                    }}
                                    className=" absolute top-1 right-1 text-white text-sm bg-black/50 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
                                    aria-label="Retirer le joueur"
                                >
                                    ✕
                                </button>
                            )}

                            <h1 className="text-white font-bold text-sm sm:text-base md:text-lg text-center ">
                                {joueur ? joueur.nom : getLabel(idCase)}
                            </h1>

                        </div>
                    );
                })}
            </div>

            {isModalOpen && selectedCase !== null && (
                <Modal
                    joueurs={users}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleSelectJoueur}
                />
            )}
        </>
    );
}
