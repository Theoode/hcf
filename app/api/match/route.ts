// app/api/match/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const matches = await prisma.match.findMany({
            include: {
                categorie: true,
                lignes: true,
            },
            orderBy: { date_match: "asc" },
        });

        if (!matches || matches.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: "Aucun match trouvé" },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true, data: matches });
    } catch (err) {
        console.error("Erreur lors de la récupération des matchs :", err);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
