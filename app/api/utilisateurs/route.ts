import prisma from "@/lib/prisma"; // ton PrismaClient côté serveur
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const utilisateurs = await prisma.utilisateur.findMany();
        return NextResponse.json(utilisateurs);
    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
