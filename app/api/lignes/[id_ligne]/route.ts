import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id_ligne: string }> }
) {
    try {
        const { id_ligne } = await context.params;
        const id = Number(id_ligne);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: "ID de ligne invalide" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("Ligne")
            .delete()
            .eq("id_ligne", id);

        if (error) {
            console.error(error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}