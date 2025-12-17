"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // App Router
// import { useRouter } from 'next/router'; // si Pages Router

interface Categorie {
    id_categorie: number;
    nom: string;
}

interface Ligne {
    id_ligne: number;
    nom?: string;
    positions: number;
}

interface Match {
    id_match: number;
    date_match: string;
    lieu?: string | null;
    score_domicile: number;
    score_exterieur: number;
    categorie: Categorie;
    lignes?: Ligne[];
}

export default function MatchesList() {
    const [matches, setMatches] = useState<Match[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/match")
            .then((res) => res.json())
            .then((data) => setMatches(data.data as Match[]))
            .catch((err) => console.error(err));
    }, []);

    const handleClick = (matchId: number) => {
        // Redirection vers la page de choix des lignes.ts
        router.push(`/home/choix-match/lignes?matchId=${matchId}`);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Matchs</h1>
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
