import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { matchId, positions } = body;

        if (!matchId || !positions || !positions.joueurs) {
            return NextResponse.json(
                { success: false, error: "Données manquantes" },
                { status: 400 }
            );
        }

        // Crée une seule ligne avec toutes les positions
        await prisma.ligne.create({
            data: {
                nom: `Ligne ${new Date().toLocaleString()}`, // tu peux personnaliser
                id_match: Number(matchId),
                positions: positions, // stocke tout l'objet JSON
            },
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
