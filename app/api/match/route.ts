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

        // Retourne en JSON
        return NextResponse.json({ success: true, data: matches });
    } catch (err) {
        console.error("Erreur lors de la récupération des matchs :", err);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
