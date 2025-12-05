"use client";

import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";

interface Utilisateur {
    id_utilisateur: number;
    prenom: string;
    nom: string;
    numero: string;
}

// Carte draggable
const PlayerCard: React.FC<{ player: Utilisateur; id: string }> = ({ player, id }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        cursor: "grab",
        touchAction: "none", // essentiel pour le drag sur mobile
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 text-white flex flex-col items-center justify-center rounded shadow-lg relative"
        >
            <div className="font-bold text-xs sm:text-sm">{player.nom}</div>
            <div className="text-xs sm:text-sm">{player.prenom}</div>
            <div className="text-xs">{player.numero}</div>
        </div>
    );
};

// Case droppable
const Slot: React.FC<{
    id: string;
    player?: Utilisateur | null;
    onRemove?: (player: Utilisateur) => void;
}> = ({ id, player, onRemove }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`w-20 h-20 sm:w-32 sm:h-32 bg-green-400 rounded border-2 border-dashed border-white flex items-center justify-center relative ${
                isOver ? "bg-green-500" : ""
            }`}
        >
            {player && (
                <>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 text-white flex flex-col items-center justify-center rounded shadow-lg relative">
                        <div className="font-bold text-xs sm:text-sm">{player.nom}</div>
                        <div className="text-xs sm:text-sm">{player.prenom}</div>
                        <div className="text-xs">{player.numero}</div>

                        {/* Croix pour retirer */}
                        <button
                            onClick={() => onRemove && onRemove(player)}
                            className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default function HockeyBoard() {
    const [players, setPlayers] = useState<Utilisateur[]>([]);
    const [slots, setSlots] = useState<(Utilisateur | null)[]>([null, null, null, null, null]);

    useEffect(() => {
        async function fetchPlayers() {
            const res = await fetch("/api/utilisateurs");
            if (!res.ok) return;
            const data: Utilisateur[] = await res.json();
            setPlayers(data);
        }
        fetchPlayers();
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const playerIdStr = String(active.id).replace("player-", "");
        const slotIdStr = String(over.id).replace("droppable-", "");

        const playerId = parseInt(playerIdStr, 10);
        const slotId = parseInt(slotIdStr, 10) - 1;

        const player = players.find((p) => p.id_utilisateur === playerId);
        if (!player) return;

        setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[slotId] = player;
            return newSlots;
        });

        setPlayers((prev) => prev.filter((p) => p.id_utilisateur !== playerId));
    };


    const handleRemoveFromSlot = (index: number) => (player: Utilisateur) => {
        setSlots((prev) => {
            const newSlots = [...prev];
            newSlots[index] = null;
            return newSlots;
        });
        setPlayers((prev) => [...prev, player]);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <main className="mt-10 p-4 flex flex-col items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Terrain de Hockey - Mobile Friendly</h1>

                <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                    {slots.map((playerInSlot, index) => (
                        <Slot
                            key={index}
                            id={`droppable-${index + 1}`}
                            player={playerInSlot}
                            onRemove={handleRemoveFromSlot(index)}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap mt-4 gap-2 sm:gap-4 justify-center">
                    {players.map((player) => (
                        <PlayerCard key={player.id_utilisateur} player={player} id={`player-${player.id_utilisateur}`} />
                    ))}
                </div>
            </main>
        </DndContext>
    );
}
