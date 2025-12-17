import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop(); // dernier segment
    const matchId = Number(idParam);

    if (isNaN(matchId)) {
        return NextResponse.json(
            { success: false, message: "MatchId invalide" },
            { status: 400 }
        );
    }

    try {
        const match = await prisma.match.findUnique({
            where: { id_match: matchId },
            include: { categorie: true, lignes: true },
        });

        if (!match) {
            return NextResponse.json(
                { success: false, message: "Match non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: match });
    } catch (err) {
        console.error("Erreur lors de la récupération du match :", err);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
