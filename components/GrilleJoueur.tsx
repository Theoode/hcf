"use client";

import React, { useEffect, useState } from "react";
import {Joueur} from "@/app/types/joueurs";
import Modal from "@/components/Modal";

interface Props {
    joueurs: number;
    assignations: Record<number, Joueur>;
    setAssignations: React.Dispatch<React.SetStateAction<Record<number, Joueur>>>;
}


export default function GrilleJoueurs({ joueurs }: Props) {
    const totalCases = 9;
    const visibleCases: number[] = [];

    if (joueurs === 3) visibleCases.push(5, 7, 9);
    else if (joueurs === 4) visibleCases.push(4, 5, 6, 8);
    else if (joueurs === 5) visibleCases.push(1, 3, 5, 7, 9);

    const [users, setUsers] = useState<Joueur[]>([]);
    const [selectedCase, setSelectedCase] = useState<number | null>(null);
    const [assignations, setAssignations] = useState<Record<number, Joueur>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** FETCH DES UTILISATEURS */

    useEffect(() => {
        fetch("/api/utilisateurs")
            .then(res => res.json())
            .then(res => {
                if (Array.isArray(res)) {
                    setUsers(res);
                } else if (res.success && Array.isArray(res.data)) {
                    setUsers(res.data);
                } else {
                    setUsers([]);
                }
            })
            .catch(() => setUsers([]));
    }, []);


    const getLabel = (idCase: number): string | null => {
        if ([1, 3, 6].includes(idCase)) return "A";
        if ([4, 7, 8, 9].includes(idCase)) return "D";
        if (idCase === 5) return joueurs === 5 ? "C" : "A";
        return null;
    };

    const handleCaseClick = (idCase: number) => {
        if (!visibleCases.includes(idCase)) return;
        setSelectedCase(idCase);
        setIsModalOpen(true);
    };

    const handleSelectJoueur = (joueur: Joueur) => {
        if (!selectedCase) return;

        const alreadyAssigned = Object.values(assignations).some(
            (j) => j.id_utilisateur === joueur.id_utilisateur
        );
        if (alreadyAssigned) {
            alert(`${joueur.prenom} est déjà assigné à un autre poste !`);
            return;
        }

        setAssignations((prev) => ({
            ...prev,
            [selectedCase]: joueur,
        }));

        setIsModalOpen(false);
        setSelectedCase(null);
    };


    return (
        <>
            {/* Grille */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 mt-22 mb-12 ml-8 mr-8">
                {Array.from({ length: totalCases }).map((_, index) => {
                    const idCase = index + 1;
                    const isVisible = visibleCases.includes(idCase);
                    const joueur = assignations[idCase];
                    const label = getLabel(idCase);

                    return (
                        <div
                            key={idCase}
                            onClick={() => handleCaseClick(idCase)}
                            className={`
                                border border-white rounded-[10px]
                                bg-[#1E1E1E]/90
                                shadow-[0_0_4px_2px_rgba(30,30,30,0.66)]
                                flex items-center justify-center cursor-pointer
                                transition-opacity duration-300
                                ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
                            `}
                        >
                            <h1 className="text-white font-bold text-xl">
                                {joueur ? joueur.nom : label}
                            </h1>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && selectedCase && (
                <Modal
                    joueurs={users}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleSelectJoueur}
                />
            )}
        </>
    );
}
