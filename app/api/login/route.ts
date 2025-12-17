import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.utilisateur.findUnique({
        where: { mail: email },
    });

    if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.mdp_hash);
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    return NextResponse.json({ success: true, userId: user.id_utilisateur });
}
