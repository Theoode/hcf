import {Categorie} from "@/app/types/categorie";
import {Ligne} from "@/app/types/lignes";

export interface Match {
    id_match: number;
    date_match: string;
    lieu?: string | null;
    score_domicile: number;
    score_exterieur: number;
    categorie: Categorie;
    lignes?: Ligne[];
}