import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            select: {
                id_utilisateur: true,
                prenom: true,
                nom: true,
                numero: true,
            },
        });

        return NextResponse.json({ success: true, data: utilisateurs });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
