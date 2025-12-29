import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email ou mot de passe manquant' },
                { status: 400 }
            )
        }

        const { data: user, error } = await supabase
            .from('Utilisateur')
            .select('*')
            .eq('mail', email)
            .single()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.mdp_hash)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Mot de passe incorrect' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            userId: user.id_utilisateur,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
