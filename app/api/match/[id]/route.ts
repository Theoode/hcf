// app/api/match/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params; // <-- attendre le promise
        const matchId = params.id ? parseInt(params.id, 10) : null;

        if (!matchId || isNaN(matchId) || matchId <= 0) {
            return NextResponse.json({ success: false, message: "ID invalide" }, { status: 400 });
        }

        const match = await prisma.match.findUnique({
            where: { id_match: matchId },
            include: { categorie: true, lignes: true },
        });

        if (!match) {
            return NextResponse.json({ success: false, message: "Match non trouvé" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: match });
    } catch (err) {
        console.error("Erreur API /api/match/[id] :", err);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}
