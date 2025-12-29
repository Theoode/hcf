import {NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { matchId, positions } = body;

        if (
            !matchId ||
            !positions ||
            !positions.format ||
            !Array.isArray(positions.joueurs) ||
            positions.joueurs.length === 0
        ) {
            return NextResponse.json(
                { success: false, message: "Données manquantes ou invalides" },
                { status: 400 }
            );
        }


        const { data, error } = await supabase
            .from("Ligne")
            .insert({
                nom: `Ligne ${new Date().toLocaleString()}`,
                id_match: Number(matchId),
                positions,
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            ligne: data,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
