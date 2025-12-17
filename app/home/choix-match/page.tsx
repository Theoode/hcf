"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Match } from "@/app/types/match";

export default function MatchesList() {
    const [matches, setMatches] = useState<Match[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/match")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setMatches(data.data as Match[]);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleClick = (matchId: number) => {
        router.push(`/home/choix-match/lignes?matchId=${matchId}`);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Matchs</h1>
            {matches.length === 0 && <p>Aucun match disponible.</p>}
            {matches.map((m) => (
                <div
                    key={m.id_match}
                    className="p-4 border rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleClick(m.id_match)}
                >
                    <p>
                        <strong>{m.categorie.nom}</strong> -{" "}
                        {new Date(m.date_match).toLocaleString()}
                    </p>
                    <p>
                        Score : {m.score_domicile} - {m.score_exterieur}
                    </p>
                    <p>Lieu : {m.lieu || "Non défini"}</p>
                </div>
            ))}
        </div>
    );
}
