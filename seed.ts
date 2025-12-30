import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // 1️⃣ Créer une catégorie
    const { data: categorieData, error: catError } = await supabase
        .from('Categorie')
        .insert({ nom: 'Équipe Test' })
        .select()
        .single();

    if (catError) throw catError;

    const categorieId = categorieData.id_categorie;

    // 2️⃣ Créer 10 utilisateurs
    for (let i = 0; i < 10; i++) {
        const prenom = `User${i + 1}`;
        const nom = `Nom${i + 1}`;
        const numero = `${i + 1}`;
        const mail = `user${i + 1}@test.com`;
        const mdp_hash = await bcrypt.hash('mdp', 10);

        const { error: userError } = await supabase
            .from('Utilisateur')
            .insert({ prenom, nom, numero, mail, mdp_hash, id_categorie: categorieId });

        if (userError) throw userError;
    }

    // 3️⃣ Créer 3 matchs
    for (let i = 0; i < 3; i++) {
        const date_match = new Date(Date.now() + i * 86400000); // chaque jour
        const lieu = `Stade ${i + 1}`;
        const score_domicile = Math.floor(Math.random() * 5);
        const score_exterieur = Math.floor(Math.random() * 5);

        const { error: matchError } = await supabase
            .from('Match')
            .insert({ date_match, lieu, score_domicile, score_exterieur, id_categorie: categorieId });

        if (matchError) throw matchError;
    }

    console.log('Seed terminé : catégorie, 10 utilisateurs et 3 matchs créés !');
}

main()
    .catch((err) => {
        console.error('Erreur seed :', err);
        process.exit(1);
    });
