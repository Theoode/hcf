import {Joueur} from "@/app/types/joueurs";

export interface Ligne {
    id_ligne: number;
    nom?: string;
    positions: Record<number, Joueur>;
    date_creation: Date;
    id_match: number;
}