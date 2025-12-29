import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Respecte exactement la casse des tables dans Supabase
        const { data: matches, error } = await supabase
            .from('Match')
            .select(`
                *,
                Categorie (*),
                Ligne (*)
            `)
            .order('date_match', { ascending: true })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: matches || [],
        })
    } catch (err) {
        console.error('Erreur lors de la récupération des matchs :', err)
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
    }
}
