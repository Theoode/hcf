// app/api/match/[id]/route.ts.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface Params {
    id: string;
}

export async function GET(
    req: Request,
    context: { params: Promise<Params> }
) {
    try {
        // await pour récupérer les params
        const params = await context.params;
        const matchId = Number(params.id);

        if (!matchId || isNaN(matchId) || matchId <= 0) {
            return NextResponse.json(
                { success: false, message: 'ID invalide' },
                { status: 400 }
            );
        }

        const { data: match, error } = await supabase
            .from('Match')
            .select(`
                *,
                Categorie (*),
                Ligne (*)
            `)
            .eq('id_match', matchId)
            .single();

        if (error || !match) {
            return NextResponse.json(
                { success: false, message: 'Match non trouvé' },
                { status: 404 }
            );
        }

        // Renommer Ligne -> Lignes pour correspondre à ton interface TS
        const formattedMatch = { ...match, Lignes: match.Ligne ?? [] };

        return NextResponse.json({ success: true, data: formattedMatch });
    } catch (err) {
        console.error('Erreur API /api/match/[id] :', err);
        return NextResponse.json(
            { success: false, message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
