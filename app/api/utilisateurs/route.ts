import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data: utilisateurs, error } = await supabase
            .from('Utilisateur')
            .select('id_utilisateur, prenom, nom, numero')

        if (error) {
            console.error(error)
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: utilisateurs ?? [],
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
