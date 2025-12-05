"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface PlayerCardProps {
    id: string;
    nom: string;
    prenom: string;
    numero: string;
    style?: React.CSSProperties;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ id, nom, prenom, numero, style }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const combinedStyle: React.CSSProperties = {
        ...style,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        cursor: "grab",
        position: "absolute",
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={combinedStyle}
            className="w-24 h-24 bg-blue-600 text-white flex flex-col items-center justify-center rounded shadow-lg"
        >
            <div className="font-bold">{nom}</div>
            <div>{prenom}</div>
            <div className="text-sm">{numero}</div>
        </div>
    );
};

export default PlayerCard;
