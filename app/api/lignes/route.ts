import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { matchId, assignations } = body;

        const lignesData = Object.entries(assignations).map(([id_case, joueur]: [string, any]) => ({
            nom: joueur.prenom,
            id_match: Number(matchId),
            positions: { poste: Number(id_case), joueur: joueur.id_utilisateur },
        }));

        // Crée les lignes en base
        await prisma.ligne.createMany({
            data: lignesData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
