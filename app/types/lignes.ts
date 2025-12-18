import { Joueur } from "@/app/types/joueurs";

export interface Ligne {
    id_ligne: number;
    nom?: string;
    positions: {
        format: 3 | 4 | 5;
        joueurs: {
            case: number;
            role: "A" | "D" | "C";
            joueur: Joueur;
        }[];
    };
    date_creation: Date;
    id_match: number;
}
